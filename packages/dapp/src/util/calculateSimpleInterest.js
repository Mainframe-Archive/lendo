// @flow

import { toBigNumber } from './formatNumber'

export default function calculateSimpleInterest(amount: number, interest: number): number {
  const principal = toBigNumber(amount || 0)
  const rate = toBigNumber(interest || 0).dividedBy(100).plus(1)

  return principal.times(rate).toNumber()
}
