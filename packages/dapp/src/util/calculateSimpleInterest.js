// @flow
import { web3 } from '../services/LoanService'
import { toBigNumber } from './formatNumber'

export default function calculateSimpleInterest(amount: number, interest: number): number {
  const principal = toBigNumber(amount || 0)
  const rate = toBigNumber(interest || 0).dividedBy(100).plus(1)

  return principal.times(rate).toNumber()
}

export function calculateInterestWithAmounts(amount: string, expectedAmount: string): number {
  const amountFromWei = toBigNumber(web3.utils.fromWei(amount))
  const expectedAmountFromWei = toBigNumber(web3.utils.fromWei(expectedAmount))
  const interest = expectedAmountFromWei.dividedBy(amountFromWei).minus(1).toNumber()
  return interest
}
