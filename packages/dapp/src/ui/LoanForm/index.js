// @flow
import React, { useState } from 'react'
import { sdk } from 'services/LoanService'
import Button from 'ui/Button'
import Field from 'ui/Field'
import Fieldset from 'ui/Fieldset'
import FormActions from 'ui/FormActions'
import FormTitle from 'ui/FormTitle'
import TitleInput from 'ui/TitleInput'
import LinkButton from 'ui/LinkButton'
import type { NewLoanData } from 'types'

type Props = {
  onSubmit: (data: NewLoanData) => void,
}

export default function LoanForm({ onSubmit }: Props) {
  const [selectedContact, setSelectedContact] = useState({})
  const [loanAmount, setLoanAmount] = useState('')
  const [interest, setInterest] = useState('')
  const [paymentPlan, setPaymentPlan] = useState(0)
  const [dueDate, setDueDate] = useState<number | void>()
  const [loanTitle, setLoanTitle] = useState('')

  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        onSubmit({
          dueDate,
          selectedContact: selectedContact,
          loanName: loanTitle,
          loanAmount: loanAmount || 0,
          interest: interest || 0,
        })
      }}>
      <FormTitle>Terms</FormTitle>

      <Fieldset>
        <TitleInput
          value={loanTitle}
          onChange={setLoanTitle}
          required
        />
      </Fieldset>

      <Fieldset legend="Set your loan details">
        <Field
          name="contact"
          label="Choose a lender"
          type="text"
          value={selectedContact.name || ''}
          onClick={() => {
            sdk.contacts.selectContact()
              .then(contact => {
                if (contact) {
                  const contactProfile = contact.data.profile

                  if (!contactProfile.ethAddress) {
                    throw new Error('The selected contact does not have a public ETH address')
                  } else {
                    setSelectedContact(contactProfile)
                  }
                }
              })
              // .catch(error => {
              //
              // })
          }}
        />

        <Field
          name="amount"
          label="Loan amount"
          type="number"
          required
          value={loanAmount}
          onChange={setLoanAmount}
        />
      </Fieldset>

      <Fieldset legend="Set your payback plan">
        <Field
          name="plan"
          label="Payment plan"
          type="select"
          required
          options={[{ id: 0, name: 'One time' }]}
          value={paymentPlan}
          onChange={setPaymentPlan}
        />

        <Field
          name="interest"
          label="Interest rate"
          type="number"
          required
          value={interest}
          onChange={setInterest}
        />

        <Field
          name="deadline"
          label="Payback deadline"
          type="date"
          required
          value={dueDate}
          onChange={value => setDueDate(value)}
          placeholder="Select deadline"
        />
      </Fieldset>

      <FormActions>
        <LinkButton to="/">Cancel</LinkButton>

        <Button primary type="submit">
          Next
        </Button>
      </FormActions>
    </form>
  )
}
