const { TestHelper } = require('zos')
const { Contracts, ZWeb3 } = require('zos-lib')
const daiAbi = require('./dai-abi.json')

ZWeb3.initialize(web3.currentProvider)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const Loan = Contracts.getFromLocal('Loan')
const ERC20 = Contracts.getFromNodeModules(
  'openzeppelin-eth',
  'StandaloneERC20',
)

contract('Loan', function(accounts) {
  const borrowerAddress = accounts[0]
  const lenderAddress = accounts[1]

  async function balancesShouldBe(
    erc20Contract,
    expectedBorrowerBalance,
    expectedLenderBalance,
  ) {
    const borrowerBalance = await erc20Contract.methods
      .balanceOf(borrowerAddress)
      .call()
    const lenderBalance = await erc20Contract.methods
      .balanceOf(lenderAddress)
      .call()

    borrowerBalance.should.be.equal(expectedBorrowerBalance)
    lenderBalance.should.be.equal(expectedLenderBalance)
  }

  async function verifyLoanCountShouldBe(
    loanContract,
    expectedBorrowerLoanCount,
    expectedLenderLoanCount,
  ) {
    const borrowerLoanCount = await loanContract.methods
      .loanCountByBorrower(borrowerAddress)
      .call()
    borrowerLoanCount.should.be.equal(expectedBorrowerLoanCount)

    const lenderLoanCount = await loanContract.methods
      .loanCountByLender(lenderAddress)
      .call()
    lenderLoanCount.should.be.equal(expectedLenderLoanCount)
  }

  beforeEach(async function() {
    this.project = await TestHelper()

    this.daiMockProxy = await this.project.createProxy(ERC20, {
      initArgs: [
        'MockDAI',
        'MOCKDAI',
        18,
        (100e18).toString(),
        lenderAddress,
        [],
        [],
      ],
    })

    this.loanProxy = await this.project.createProxy(Loan, {
      initMethod: 'initialize',
      initArgs: [this.daiMockProxy.options.address],
    })
  })

  it('should not allow to borrow money from yourself', async function() {
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())

    this.loanProxy.methods
      .requestLoan(
        borrowerAddress,
        'This request should actually fail',
        10,
        new Date('2050-01-01T00:00:00Z').getTime() / 1000,
        11
      )
      .send({ from: borrowerAddress, gas: 5000000 }).should.be.rejected

    // Check if balances remains the same after the request attempt
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())
  })

  it('should allow the lender to approve the loan', async function() {
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())
    await verifyLoanCountShouldBe(this.loanProxy, '0', '0')

    // Check allowance pre-condition
    const proxyAddress = this.loanProxy.options.address

    let lenderAllowance = await this.daiMockProxy.methods
      .allowance(lenderAddress, proxyAddress)
      .call()
    lenderAllowance.should.be.equal('0')

    // Approve transfer allowance
    const amount = (10e18).toString()
    const expectedAmount = (11*10e18).toString()

    await this.daiMockProxy.methods
      .approve(proxyAddress, amount)
      .send({ from: lenderAddress, gas: 5000000 })
    lenderAllowance = await this.daiMockProxy.methods
      .allowance(lenderAddress, proxyAddress)
      .call()
    lenderAllowance.should.be.equal(amount)

    // Request loan
    const { events } = await this.loanProxy.methods
      .requestLoan(
        lenderAddress,
        'This is a test loan request',
        amount,
        new Date('2050-01-01T00:00:00Z').getTime() / 1000,
        expectedAmount
      )
      .send({ from: borrowerAddress, gas: 5000000 })
    events.should.have.key('LoanRequested')
    const { borrower, lender, name } = events['LoanRequested'].returnValues
    borrower.should.be.equal(borrowerAddress)
    lender.should.be.equal(lenderAddress)
    name.should.be.equal('This is a test loan request')

    // Balances should still be the same because only the request happened
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())

    // Verify saved loan mapping associations
    await verifyLoanCountShouldBe(this.loanProxy, '1', '1')

    const loanIdx = await this.loanProxy.methods
      .loansByBorrower(borrowerAddress, 0)
      .call()
    loanIdx.should.be.equal('0')

    // Verify saved loan data on blockchain
    const totalLoanCount = await this.loanProxy.methods.totalLoanCount().call()
    totalLoanCount.should.be.equal('1')

    const loan = await this.loanProxy.methods.loans(loanIdx).call()
    loan.lender.should.be.equal(lender)
    loan.borrower.should.be.equal(borrower)
    loan.name.should.be.equal('This is a test loan request')
    loan.amount.should.be.equal((10e18).toString())
    loan.dueDate.should.be.equal(
      (new Date('2050-01-01T00:00:00Z').getTime() / 1000).toString(),
    )
    loan.status.should.be.equal('0')
  })
})
