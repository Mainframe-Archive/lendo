// @flow
import React, { useState, useContext, useEffect } from 'react'
// import styled from 'styled-components'
import MainframeContext from '../contexts/Mainframe'

import { abi, contractAddress } from '../abi'

// const Container = styled.View`
//   flex: 1;
//   flex-direction: row;
//   width: 300px;
//   height: 300px;
//   background-color: #262626;
// `

export default function Dashboard() {
  const { sdk, web3 } = useContext(MainframeContext)
  const [showNewLoan, setShowNewLoan] = useState(false)
  const [selectedContact, setSelectedContact] = useState('')
  const [loanAmount, setLoanAmount] = useState(0)
  const [loanDueDate, setLoanDueDate] = useState()
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [showMsg, setShowMsg] = useState(false)

  const [contract, setContract] = useState()
  useEffect(() => {
    const initializeContract = async () => {
      const contract = new web3.eth.Contract(abi, contractAddress)
      setContract(contract)
    }
    initializeContract()
  }, [web3])

  const [ownAccount, setOwnAccount] = useState()
  useEffect(() => {
    const initializeOwnAccount = async () => {
      const ownAccount = await sdk.ethereum.getDefaultAccount()
      setOwnAccount(ownAccount)
    }
    initializeOwnAccount()
  }, [sdk])

  const [loans, setLoans] = useState([])
  // useEffect(() => {
  //   if (!contract || !ownAccount) return
  //   console.log('contract', contract)
  //   console.log('ownAccount', ownAccount)
  //   const fetchForLoans = async () => {
  //     const newLoans = await contract.methods.getLoanAtAddress(ownAccount).call()
  //     setLoans(Object.entries(newLoans))
  //   }
  //   fetchForLoans()
  // }, [contract])

  async function selectContactFromMainframe() {
    const contact = await sdk.contacts.selectContact()
    if (contact) {
      const { ethAddress } = contact.data.profile
      if (!ethAddress) {
        console.log('The selected contact does not have a public ETH address')
      } else {
        setSelectedContact(ethAddress)
      }
    }
  }

  async function createNewLoanContract(event) {
    event.preventDefault()
    setLoadingStatus(true)

    const writeLoan = await contract.methods
      .requestLoanRob(selectedContact, loanAmount)
      .send({ from: ownAccount })

    setShowMsg(true)
    setShowNewLoan(false)
    setLoadingStatus(false)

    setTimeout(() => {
      setShowMsg(false)
    }, 3000)
  }

  if (loadingStatus) return <div>Loading...</div>
  return (
    <div className="App">
      <h1>{showMsg ? 'Loan created successfully!' : ''}</h1>
      <h1>My Loans</h1>
      {loans.map((loan, key) => (
        <div key={key}>{loan}</div>
      ))}
      {showNewLoan ? (
        <form style={{ justifyContent: 'center' }}>
          <div className="form-container">
            <div className="row-item">
              <div>Lender</div>
              <button
                type='button'
                onClick={selectContactFromMainframe}>
                Select your Friend
              </button>
              <div>{selectedContact}</div>
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
