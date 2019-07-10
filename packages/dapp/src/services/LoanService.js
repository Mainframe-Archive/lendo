import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { loanAbi, getLoanContractAddress } from 'contracts/loan'
import { erc20Abi, getDaiContractAddress } from 'contracts/erc20'
import type { Address, LoanData, NewLoanData } from 'types'
import { toIntString } from 'util/formatNumber'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)

export function getLoanContract(networkVersion) {
  return new web3.eth.Contract(loanAbi, getLoanContractAddress(networkVersion))
}

export function getDAIContract(networkVersion) {
  return new web3.eth.Contract(erc20Abi, getDaiContractAddress(networkVersion))
}

export function getOwnAccount(): Promise<Address> {
  return sdk.ethereum.getDefaultAccount()
}

export function getNetworkVersion() {
  return sdk.ethereum.networkVersion
}

export function requestLoan(
  data: NewLoanData,
  senderAddress: Address,
): Promise<void> {
  const networkVersion = sdk.ethereum.networkVersion
  const loanContract = getLoanContract(networkVersion)

  return loanContract.methods
    .requestLoan(
      '0x4d9ef50a0389b09315b2946031493548a0ad5db5',
      data.loanName,
      parseInt(toIntString(data.loanAmount)),
      new Date(data.dueDate).getTime() / 1000,
    )
    .send({ from: senderAddress })
}

export async function approveDAITransfer(
  loan: LoanData,
  senderAddress: Address,
): Promise<void> {

  const networkVersion = sdk.ethereum.networkVersion
  const DAIContract = getDAIContract(networkVersion)
  const loanContractAddress = getLoanContractAddress(networkVersion)

  return DAIContract.methods
    .approve(loanContractAddress, Number(loan.amount))
    .send({ from: senderAddress })
}

export async function approveLoan(
  index: number,
  senderAddress: Address,
): Promise<void> {

  const networkVersion = sdk.ethereum.networkVersion
  const loanContract = getLoanContract(networkVersion)

  return loanContract.methods.approveLoan(index).send({ from: senderAddress })
}

export function useOwnAccount(): Address | null {
  const [ownAccount, setOwnAccount] = useState(null)

  useEffect(() => {
    getOwnAccount().then(setOwnAccount)
  }, [])

  return ownAccount
}

export function useBorrowedLoans(borrowerAddress: Address): Array<LoanData> {
  const [loans, setLoans] = useState([])
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  useEffect(() => {
    const getLoansByBorrower_ = async () => {
      try {
        const newLoans = []
        const loansArrayLength = await loanContract.methods
          .loanCountByBorrower(borrowerAddress)
          .call()

        //change for paralell requests in the future - ordenation needed
        for (let i = 0; i < loansArrayLength; i++) {
          const loanIndex = await loanContract.methods
            .loansByBorrower(borrowerAddress, i)
            .call()

          const currentLoan = await loanContract.methods.loans(loanIndex).call()

          newLoans.push(currentLoan)
        }
        setLoans(newLoans)
      } catch (err) {
        console.error(err)
      }
    }
    if (borrowerAddress) getLoansByBorrower_()
    // eslint-disable-next-line
  }, [borrowerAddress, networkVersion])

  return loans
}

export function useLendedLoans(lenderAddress: Address): Array<LoanData> {
  const [loans, setLoans] = useState([])
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  useEffect(() => {
    const getLoansByLender_ = async () => {
      try {
        const newLoans = []
        const loansArrayLength = await loanContract.methods
          .loanCountByLender(lenderAddress)
          .call()

        //change for paralell requests in the future - ordenation needed
        for (let i = 0; i < loansArrayLength; i++) {
          const loanIndex = await loanContract.methods
            .loansByLender(lenderAddress, i)
            .call()

          const currentLoan = await loanContract.methods.loans(loanIndex).call()

          newLoans.push(currentLoan)
        }
        setLoans(newLoans)
      } catch (err) {
        console.error(err)
      }
    }

    if (lenderAddress) getLoansByLender_()
    // eslint-disable-next-line
  }, [lenderAddress, networkVersion])

  return loans
}
