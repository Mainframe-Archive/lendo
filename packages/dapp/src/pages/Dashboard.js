// @flow
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { sdk, web3, contract } from 'services/Mainframe'
import { useBorrowerLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'

<<<<<<< HEAD
export default function Dashboard () {
=======
export default function Dashboard() {
>>>>>>> develop
  const [showNewLoan, setShowNewLoan] = useState(false)
  const [selectedContact, setSelectedContact] = useState('')
  const [loanAmount, setLoanAmount] = useState(0)
  const [loanDueDate, setLoanDueDate] = useState()
  const [loanName, setLoanName] = useState()
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [showMsg, setShowMsg] = useState(false)

  const [ownAccount, setOwnAccount] = useState()
  useEffect(() => {
    const initializeOwnAccount = async () => {
      const ownAccount = await sdk.ethereum.getDefaultAccount()
      setOwnAccount(ownAccount)
    }
    initializeOwnAccount()
  }, [])

  const loans = useBorrowerLoans(ownAccount)

  async function selectContactFromMainframe() {
    const contact = await sdk.contacts.selectContact()
    if (contact) {
      const { ethAddress } = contact.data.profile
      if (!ethAddress) {
        //error msg
        // console.log('The selected contact does not have a public ETH address')
      } else {
        setSelectedContact(ethAddress)
      }
    }
  }

  async function createNewLoanContract(event) {
    event.preventDefault()
    setLoadingStatus(true)
    if (contract) {
      const dueDate = new Date(loanDueDate).getTime() / 1000
      const writeLoan = await contract.methods
        .requestLoan(selectedContact, loanName, loanAmount, dueDate)
        .send({ from: ownAccount })

      if (writeLoan) {
        setShowMsg(true)
        setShowNewLoan(false)
        setLoadingStatus(false)
      } else {
        // error msg
      }

      setTimeout(() => {
        setShowMsg(false)
      }, 3000)
    }
  }

  if (loadingStatus) return <div>Loading...</div>
  return (
    <div className="App">
      <h1>{showMsg ? 'Loan created successfully!' : ''}</h1>
      <h1>My Loans</h1>
      {LoansTable(loans)}
      {showNewLoan ? (
        <form style={{ justifyContent: 'center' }}>
          <div className="form-container">
            <div className="row-item">
              <div>Lender</div>
              <button type="button" onClick={selectContactFromMainframe}>
                Select your Friend
              </button>
              <div>{selectedContact}</div>
            </div>
            <div className="row-item">
              <div>Name</div>
              <input
                value={loanName}
                onChange={e => setLoanName(e.target.value)}
                type="text"
              />
            </div>
            <div className="row-item">
              <div>Amount (DAI)</div>
              <input
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
                type="text"
              />
            </div>
            <div className="row-item">
              <div>Due Date</div>
              <input
                value={loanDueDate}
                onChange={e => setLoanDueDate(e.target.value)}
                type="date"
              />
            </div>
            <div className="row-item">
              <div>Payment Plan</div>
              <input disabled type="text" value={'One time'} />
            </div>
            <div className="row-item">
              <div>Interest</div>
              <input disabled type="text" value={'1.27%'} />
            </div>
            <div className="row-item" style={{ marginTop: '15px' }}>
              <div>Total Debit Value: {calcDebt(loanAmount)}</div>
            </div>
            <button onClick={event => createNewLoanContract(event)}>
              {' '}
              Send Loan Request
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setShowNewLoan(true)}>
          {' '}
          New Loan{' '}
        </button>
      )}
    </div>
  )
}

function calcDebt(amount) {
  const interest = 0.0127
  const newAmount = amount * (1 + interest)
  return newAmount
}
