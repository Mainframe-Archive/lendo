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
  const borrower = accounts[0]
  const lender = accounts[1]

  beforeEach(async function() {
    this.project = await TestHelper()

    this.daiMockProxy = await this.project.createProxy(ERC20, {
      initArgs: [
        'MockDAI',
        'MOCKDAI',
        18,
        (100e18).toString(),
        lender,
        [lender],
        [lender],
      ],
    })

    this.loanProxy = await this.project.createProxy(Loan, {
      initMethod: 'initialize',
      initArgs: [this.daiMockProxy.options.address],
    })
  })

  it('should not allow to borrow money from yourself', async function() {
    this.loanProxy.methods
      .requestLoan(borrower, 10)
      .send({ from: borrower, gas: 5000000 }).should.be.rejected

    const borrowerBalance = await this.daiMockProxy.methods
      .balanceOf(borrower)
      .call()
    const lenderBalance = await this.daiMockProxy.methods
      .balanceOf(lender)
      .call()

    borrowerBalance.should.be.equal('0')
    lenderBalance.should.be.equal((100e18).toString())
  })

  it('should allow the lender to approve the loan', async function() {
    const borrowerBalance = await this.daiMockProxy.methods
      .balanceOf(borrower)
      .call()
    const lenderBalance = await this.daiMockProxy.methods
      .balanceOf(lender)
      .call()

    const proxyAddress = this.loanProxy.options.address

    let lenderAllowance = await this.daiMockProxy.methods
      .allowance(lender, proxyAddress)
      .call()
    lenderAllowance.should.be.equal('0')

    const amount = (10e18).toString()
    await this.daiMockProxy.methods
      .approve(proxyAddress, amount)
      .send({ from: lender, gas: 5000000 })
    lenderAllowance = await this.daiMockProxy.methods
      .allowance(lender, proxyAddress)
      .call()
    lenderAllowance.should.be.equal(amount)

    const ret = await this.loanProxy.methods
      .requestLoan(lender, amount)
      .send({ from: borrower, gas: 5000000 })
  })
})
