import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { loanAbi, getLoanContractAddress } from 'contracts/loan'
import { erc20Abi, getDaiContractAddress } from 'contracts/erc20'
import type { Address, LoanData, NewLoanData } from 'types'
import type { Contact } from '@mainframe/sdk/cjs/types'
import calculateSimpleInterest from '../util/calculateSimpleInterest'

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

export function getContactByAddress(address: Address): Promise<Contact> {
  return sdk.contacts.getApprovedContacts().then((contacts: Array<Contact>) => {
    return contacts.find(contact => {
      return contact.data.profile.ethAddress.toLowerCase() === address.toLowerCase()
    })
  })
}

export function getNetworkVersion() {
  return sdk.ethereum.networkVersion
}

export function requestLoan(
  data: NewLoanData,
  senderAddress: Address,
): Promise<void> {
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  const expectedAmount = calculateSimpleInterest(data.loanAmount, data.interest).toString()

  const amountToWei = web3.utils.toWei(data.loanAmount, 'ether')
  const expectedAmounToWei = web3.utils.toWei(expectedAmount, 'ether')

  return loanContract.methods
    .requestLoan(
      data.selectedContact.ethAddress,
      data.loanName,
      amountToWei,
      new Date(data.dueDate).getTime() / 1000,
      expectedAmounToWei
    )
    .send({ from: senderAddress })
}

export function approveDAITransfer(
  amountToApprove: number,
  senderAddress: Address,
): Promise<void> {
  const networkVersion = getNetworkVersion()
  const DAIContract = getDAIContract(networkVersion)
  const loanContractAddress = getLoanContractAddress(networkVersion)

  return DAIContract.methods
    .approve(loanContractAddress, amountToApprove)
    .send({ from: senderAddress })
}

export function approveLoan(
  index: number,
  senderAddress: Address,
): Promise<void> {
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  return loanContract.methods.approveLoan(index).send({ from: senderAddress })
}

export function payDebt(
  index: number,
  senderAddress: Address,
): Promise<void> {
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  return loanContract.methods.payDebt(index).send({ from: senderAddress })
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

export function useBorrowedLoanById(
  borrowerAddress: Address,
  index: number,
): LoanData | null {
  const [loan, setLoan] = useState(null)
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  useEffect(() => {
    if (borrowerAddress) {
      loanContract.methods
        .loansByBorrower(borrowerAddress, index)
        .call()
        .then(loanIndex => loanContract.methods.loans(loanIndex).call())
        .then(setLoan)
    }
    // eslint-disable-next-line
  }, [borrowerAddress, networkVersion])

  return loan
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

export function useLendedLoanById(
  lenderAddress: Address,
  index: number,
): LoanData | null {
  const [loan, setLoan] = useState(null)
  const networkVersion = getNetworkVersion()
  const loanContract = getLoanContract(networkVersion)

  useEffect(() => {
    if (lenderAddress) {
      loanContract.methods
        .loansByLender(lenderAddress, index)
        .call()
        .then(loanIndex => loanContract.methods.loans(loanIndex).call())
        .then(setLoan)
    }
    // eslint-disable-next-line
  }, [lenderAddress, networkVersion])

  return loan
}
