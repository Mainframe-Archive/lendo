import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { abi, contractAddress } from 'abi'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)
export const contract = new web3.eth.Contract(abi, contractAddress)

export function getOwnAccount () {
  return sdk.ethereum.getDefaultAccount()
}

export function useOwnAccount () {
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
        const loansArrayLength = await contract.methods
        .loanCountByBorrower(borrowerAddress)
        .call()

        //change for paralell requests in the future - ordenation needed
        for (let i = 0; i < loansArrayLength; i++) {
          const loanIndex = await contract.methods
          .loansByBorrower(borrowerAddress, i)
          .call()

          const currentLoan = await contract.methods
          .loans(loanIndex)
          .call()

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
        const loansArrayLength = await contract.methods
        .loanCountByLender(lenderAddress)
        .call()

        //change for paralell requests in the future - ordenation needed
        for (let i = 0; i < loansArrayLength; i++) {
          const loanIndex = await contract.methods
          .loansByLender(lenderAddress, i)
          .call()

          const currentLoan = await contract.methods
          .loans(loanIndex)
          .call()

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
