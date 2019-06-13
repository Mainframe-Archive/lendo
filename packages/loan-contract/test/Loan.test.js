const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('openzeppelin-test-helpers')
const { TestHelper } = require('zos')
const { Contracts, ZWeb3 } = require('zos-lib')
const daiAbi = require('./dai-abi.json')

ZWeb3.initialize(web3.currentProvider)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const Loan = Contracts.getFromLocal('Loan')

const KOVAN_DAI_CONTRACT = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2'
const daiContract = ZWeb3.contract(daiAbi, KOVAN_DAI_CONTRACT)

contract('Loan', function(accounts) {
  const borrower = accounts[0]
  const lender = accounts[1]

  beforeEach(async function() {
    this.project = await TestHelper()
    this.proxy = await this.project.createProxy(Loan)
  })

  it('should not allow to borrow money from yourself', function() {
    return this.proxy.methods
      .requestLoan(borrower, 10)
      .send({ from: borrower }).should.be.rejected
  })

  it('should allow the lender to approve the loan', async function() {
    const borrowerBalance = new BN(
      await daiContract.methods.balanceOf(borrower).call(),
    )
    const lenderBalance = new BN(
      await daiContract.methods.balanceOf(lender).call(),
    )
    const proxyAddress = this.proxy.options.address

    let lenderAllowance = new BN(
      await daiContract.methods.allowance(lender, proxyAddress).call(),
    )
    lenderAllowance.should.be.bignumber.equal(new BN(0))
    const amount = new BN(10)

    await daiContract.methods
      .approve(proxyAddress, amount.toString())
      .send({ from: lender })
    lenderAllowance = new BN(
      await daiContract.methods.allowance(lender, proxyAddress).call(),
    )
    lenderAllowance.should.be.bignumber.equal(amount)

    const idx = await this.proxy.methods
      .requestLoan(lender, amount.toString())
      .send({ from: borrower })
  })
})
