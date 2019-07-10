import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { loanAbi, loanContractAddress } from 'contracts/loan'
import { erc20Abi, DAIContractAddress } from 'contracts/erc20'
import type { Address, LoanData, NewLoanData } from 'types'
import { toIntString } from 'util/formatNumber'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)
export const loanContract = new web3.eth.Contract(loanAbi, loanContractAddress)
export const DAIContract = new web3.eth.Contract(erc20Abi, DAIContractAddress)

export function getOwnAccount(): Promise<Address> {
  return sdk.ethereum.getDefaultAccount()
}

export function requestLoan(
  data: NewLoanData,
  senderAddress: Address,
): Promise<void> {
  return loanContract.methods
    .requestLoan(
      data.selectedContact.ethAddress,
      data.loanName,
      parseInt(toIntString(data.loanAmount)),
      new Date(data.dueDate).getTime() / 1000,
    )
    .send({ from: senderAddress })
}

export function approveDAITransfer(
  loan: LoanData,
  senderAddress: Address,
): Promise<void> {
  return DAIContract.methods
    .approve(loanContractAddress, Number(loan.amount))
    .send({ from: senderAddress })
}

export function approveLoan(
  index: number,
  senderAddress: Address,
): Promise<void> {
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
  }, [borrowerAddress])

  return loans
}

export function useLendedLoans(lenderAddress: Address): Array<LoanData> {
  const [loans, setLoans] = useState([])

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
  }, [lenderAddress])

  return loans
}
