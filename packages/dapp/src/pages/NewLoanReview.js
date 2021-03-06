// @flow
import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, Column, Checkbox } from '@morpheus-ui/core'
import Layout from 'ui/Layouts/default'
import Button from 'ui/Button'
import Fieldset from 'ui/Fieldset'
import FormActions from 'ui/FormActions'
import FormContainer from 'ui/FormContainer'
import FormTitle from 'ui/FormTitle'
import LinkButton from 'ui/LinkButton'
import type { NewLoanData } from 'types'
import formatNumber from 'util/formatNumber'
import calculateSimpleInterest from 'util/calculateSimpleInterest'
import { format } from 'date-fns'
import { useOwnAccount, requestLoan } from 'services/LoanService'
import { primary } from 'theme'

type Props = {
  history: any,
  location: any,
}

const EthAddress = styled.span`
  word-break: break-all;

  h3 {
    margin-bottom: 0;
  }

  p {
    margin: 8px 0;
  }
`

const humanReadableDate = (date: Date): string => format(date, 'MM/DD/YYYY')

export default function NewLoanReview({ history, location }: Props) {
  const ownName = 'Satoshi Nakamoto'
  const ownAccount = useOwnAccount()
  const [accepted, setAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const loanData: NewLoanData = location.state

  if (!loanData) {
    history.push('/new-loan/setup')
    return null
  }

  const totalDebit = calculateSimpleInterest(
    loanData.loanAmount,
    loanData.interest,
  ).toFixed(2)

  const submitLoan = () => {
    setIsLoading(true)
    setError(null)

    requestLoan(loanData, ownAccount)
      .then(() => {
        history.push('/')
      })
      .catch(error => {
        // error msg
        setError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return (
      <Layout title="Sending contract">
        <h1>Loading</h1>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Error">
        <FormContainer>
          <pre>{JSON.stringify(error, null, 2)}</pre>

          <FormActions>
            <Button onClick={submitLoan} primary>
              Retry
            </Button>

            <LinkButton to="/new-loan/setup">Review Terms</LinkButton>
          </FormActions>
        </FormContainer>
      </Layout>
    )
  }

  return (
    <Layout title="New loan">
      <FormContainer>
        <FormTitle>Loan Contract</FormTitle>

        <div>
          <Fieldset>
            <h1>{loanData.loanName}</h1>

            <p>
              This contract is entered into by and between the below named
              parties [Lender and Borrower.] This loan will expire at the close
              of the business on {humanReadableDate(loanData.dueDate)}.
            </p>

            <Row size={2}>
              <Column>
                <EthAddress>
                  <h3>"Lender"</h3>
                  <p>{loanData.selectedContact.name}</p>
                  <p>{loanData.selectedContact.ethAddress}</p>
                </EthAddress>
              </Column>

              <Column>
                <EthAddress>
                  <h3>"Borrower"</h3>
                  <p>{ownName}</p>
                  <p>{ownAccount}</p>
                </EthAddress>
              </Column>
            </Row>
          </Fieldset>

          <Fieldset legend="Loan terms">
            <p>
              {loanData.selectedContact.name} agrees to loan {ownName}{' '}
              <strong>{formatNumber(loanData.loanAmount)} DAI</strong> upon
              signing this contract. {ownName} agrees to pay{' '}
              {loanData.selectedContact.name} back loan amount plus APR of{' '}
              <strong>{formatNumber(loanData.interest)}%</strong>. The total
              payback amount is <strong>{formatNumber(totalDebit)} DAI</strong>{' '}
              due on {humanReadableDate(loanData.dueDate)}.
            </p>
          </Fieldset>

          <Fieldset legend="Signatures">
            <p>
              By signing, you agree that you have read and agree to the loan
              terms set above. Upon signing, the loan will be automatically sent
              to {loanData.selectedContact.name}.
            </p>

            <Checkbox
              name="accepted"
              label="I agree to a processing fee of 200 MFT"
              required
              defaultValue={accepted}
              onChange={setAccepted}
              theme={{
                checkSymbolColor: primary,
                containerBorderColor: primary,
                containerCheckedShadow: false,
                containerCheckedBorderColor: primary,
                labelColor: primary,
                fontSize: '1.3rem',
              }}
            />
          </Fieldset>
        </div>

        <FormActions>
          <LinkButton to="/">Cancel</LinkButton>

          <Button primary disabled={!accepted} onClick={submitLoan}>
            Sign & Send
          </Button>
        </FormActions>
      </FormContainer>
    </Layout>
  )
}
