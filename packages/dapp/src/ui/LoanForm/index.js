// @flow
import React, { useState, useEffect } from 'react'
import {sdk} from "services/LoanService"
import Button from 'ui/Button'

type Props = {
  onSubmit: (data: mixed) => void
}

export default function LoanForm ({ onSubmit }: Props) {
  const [selectedContact, setSelectedContact] = useState('')
  const [loanAmount, setLoanAmount] = useState(0)
  const [loanDueDate, setLoanDueDate] = useState<number|void>()
  const [loanName, setLoanName] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  return (
    <form style={{ justifyContent: 'center' }} onSubmit={event => {
      event.preventDefault()
      setSubmitting(true)
      const dueDate = new Date(loanDueDate).getTime() / 1000

      onSubmit({
        dueDate,
        selectedContact,
        loanName,
        loanAmount
      })
      setSubmitting(false)
    }}>
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
        <Button type="submit" disabled={submitting}>
          Send Loan Request
        </Button>
      </div>
    </form>
  )
}

function calcDebt(amount) {
  const interest = 0.0127
  const newAmount = amount * (1 + interest)
  return newAmount
}
