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

  beforeEach(async function() {
    this.project = await TestHelper()

    this.daiMockProxy = await this.project.createProxy(ERC20, {
      initArgs: [
        'MockDAI',
        'MOCKDAI',
        18,
        (100e18).toString(),
        lenderAddress,
        [lenderAddress],
        [lenderAddress],
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
      .requestLoan(borrowerAddress, 'This request should actually fail', 10)
      .send({ from: borrowerAddress, gas: 5000000 }).should.be.rejected

    // Check if balances remains the same after the request attempt
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())
  })

  it('should allow the lender to approve the loan', async function() {
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())

    // Check allowance pre-condition
    const proxyAddress = this.loanProxy.options.address

    let lenderAllowance = await this.daiMockProxy.methods
      .allowance(lenderAddress, proxyAddress)
      .call()
    lenderAllowance.should.be.equal('0')

    // Approve transfer allowance
    const amount = (10e18).toString()
    await this.daiMockProxy.methods
      .approve(proxyAddress, amount)
      .send({ from: lenderAddress, gas: 5000000 })
    lenderAllowance = await this.daiMockProxy.methods
      .allowance(lenderAddress, proxyAddress)
      .call()
    lenderAllowance.should.be.equal(amount)

    // Request loan
    const { events } = await this.loanProxy.methods
      .requestLoan(lenderAddress, 'This is a test loan request', amount)
      .send({ from: borrowerAddress, gas: 5000000 })
    events.should.have.key('LoanRequested')
    const { borrower, lender, name } = events['LoanRequested'].returnValues
    borrower.should.be.equal(borrowerAddress)
    lender.should.be.equal(lenderAddress)
    name.should.be.equal('This is a test loan request')

    // Balances should still be the same because only the request happened
    await balancesShouldBe(this.daiMockProxy, '0', (100e18).toString())
  })
})
