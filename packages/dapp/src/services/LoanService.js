import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { loanAbi, loanAddress } from 'contracts/loan'
import { erc20Abi, erc20Address } from 'contracts/erc20'
import type { NewLoanData } from 'types'
import { toIntString } from 'util/formatNumber'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)
export const loanContract = new web3.eth.Contract(loanAbi, loanAddress)
export const erc20Contract = new web3.eth.Contract(erc20Abi, erc20Address)

export function getOwnAccount() {
  return sdk.ethereum.getDefaultAccount()
}

export function useOwnAccount() {
  const [ownAccount, setOwnAccount] = useState()

  useEffect(() => {
    getOwnAccount().then(setOwnAccount)
  }, [])

  return ownAccount
}

export function useBorrowerLoans(borrowerAddress) {
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
        console.log('err', err)
      }
    }
    if (borrowerAddress) getLoansByBorrower_()
  }, [borrowerAddress])

  return loans
}

export function useLendedLoans(lenderAddress) {
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
        console.log('err', err)
      }
    }

    if (lenderAddress) getLoansByLender_()
  }, [lenderAddress])

  return loans
}

export function requestLoan(data: NewLoanData): Promise<void> {
  return loanContract.methods.requestLoan(
    data.selectedContact.ethAddress,
    data.loanName,
    parseInt(toIntString(data.loanAmount)),
    new Date(data.dueDate).getTime() / 1000,
  )
}
