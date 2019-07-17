// @flow
import BigNumber from 'bignumber.js'
import { web3 } from '../services/LoanService'

export default function formatNumber(
  value: string | number,
  decimals: number = 2,
): string {
  const raw = toIntString(value)

  if (raw.length === 0) {
    return raw
  }

  const result = new BigNumber(raw).dividedBy(Math.pow(10, decimals))

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
  })

  return formatter.format(result.toNumber())
}

export const toIntString = (value: string | number): string =>
  value
    .toString()
    .replace(/\D/g, '')
    .trim()

export const toBigNumber = (value: BigNumber.Value): BigNumber =>
  new BigNumber(toIntString(value)).dividedBy(100)

export const fromWei = (value: BigNumber.Value): string => web3.utils.fromWei(value)
