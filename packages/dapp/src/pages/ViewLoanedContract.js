// @flow
import React, { useState } from 'react'
import Layout from 'ui/Layouts/default'
import AcceptedIcon from 'ui/AcceptedIcon'
import Button from 'ui/Button'
import Fieldset from 'ui/Fieldset'
import FormActions from 'ui/FormActions'
import FormContainer from 'ui/FormContainer'
import FormTitle from 'ui/FormTitle'
import LinkButton from 'ui/LinkButton'
import { Column, Row } from '@morpheus-ui/core'
import {
  approveDAITransfer,
  approveLoan,
  getContactByAddress,
  useLendedLoanById,
  useOwnAccount,
  useOwnName,
} from 'services/LoanService'
import type { LoanData } from 'types'
import styled from 'styled-components'
import formatNumber from 'util/formatNumber'
import calculateSimpleInterest from 'util/calculateSimpleInterest'
import toShortDate from 'util/toShortDate'

const EthAddress = styled.span`
  word-break: break-all;

  h3 {
    margin-bottom: 0;
  }

  p {
    margin: 8px 0;
  }
`

type Props = {
  match: any,
  history: any,
}

export default function ViewLoanedContract({ match, history }: Props) {
  const loanIndex = match.params.loanId
  const ownName = useOwnName()
  const ownAccount = useOwnAccount()
  const [isSendingLoan, setIsSendingLoan] = useState(false)
  const [error, setError] = useState(null)
  const loanData: LoanData = useLendedLoanById(ownAccount, loanIndex)
  const [borrowerName, setBorrowerName] = useState('')
  const [step, setStep] = useState(0)

  let totalDebit = 0

  function acceptLoan(loan: LoanData, index) {
    setIsSendingLoan(true)
    setError(null)
    setStep(1)

    approveDAITransfer(loan, ownAccount)
      .then(() => {
        console.log('dai transfer approved!')
        setStep(2)
        return approveLoan(index, ownAccount)
      })
      .then(() => {
        console.log('finished both contracts successfully')
        history.push('/loaned')
      })
      .catch(error => {
        setError(error)
        setStep(0)
      })
      .finally(() => {
        setIsSendingLoan(false)
      })
  }

  if (loanData) {
    getContactByAddress(loanData.borrower).then(borrower =>
      setBorrowerName(borrower.data.profile.name),
    )
    // TODO: interest should be read from smart contract
    loanData.interest = 1500

    totalDebit = calculateSimpleInterest(
      loanData.amount,
      loanData.interest,
    ).toFixed(2)
  } else {
    return (
      <Layout title="Contract: ">
        <h1>Loading</h1>
      </Layout>
    )
  }

  if (isSendingLoan) {
    if (step === 1) {
      return (
        <Layout title="Approving DAI transfer">
          <h1>First you have to allow the contract to transfer DAI transfer on your behalf.</h1>
        </Layout>
      )
    } else if (step === 2) {
      return (
        <Layout title="Approving loan contract">
          <h1>Now proceed to approve the loan and send the funds.</h1>
        </Layout>
      )
    }
  }

  if (error) {
    return (
      <Layout title="Error">
        <FormContainer>
          <pre>{JSON.stringify(error, null, 2)}</pre>

          <FormActions>
            {loanData.status === '0' && (
              <Button onClick={() => acceptLoan(loanData, loanIndex)} primary>
                Retry
              </Button>
            )}

            <LinkButton to="/loaned">Return to loans</LinkButton>
          </FormActions>
        </FormContainer>
      </Layout>
    )
  }

  return (
    <Layout title={`Contract: ${loanData.name}`}>
      <FormContainer>
        <FormTitle>Loan Contract</FormTitle>

        <div>
          <Fieldset>
            <h1>{loanData.name}</h1>

            <p>
              This contract is entered into by and between the below named
              parties [Lender and Borrower.] This loan will expire at the close
              of the business on {toShortDate(loanData.dueDate * 1000)}.
            </p>

            <Row size={2}>
              <Column>
                <EthAddress>
                  <h3>"Lender"</h3>
                  <p>{ownName}</p>
                  <p>{loanData.lender}</p>
                </EthAddress>
              </Column>

              <Column>
                <EthAddress>
                  <h3>"Borrower"</h3>
                  <p>{borrowerName}</p>
                  <p>{loanData.borrower}</p>
                </EthAddress>
              </Column>
            </Row>
          </Fieldset>

          <Fieldset legend="Loan terms">
            <p>
              {ownName} agrees to loan {borrowerName}{' '}
              <strong>{formatNumber(loanData.amount)} DAI</strong> upon signing
              this contract. {borrowerName} agrees to pay {ownName} back loan
              amount plus APR of{' '}
              <strong>{formatNumber(loanData.interest)}%</strong>. The total
              payback amount is <strong>{formatNumber(totalDebit)} DAI</strong>{' '}
              due on {toShortDate(loanData.dueDate * 1000)}.
            </p>
          </Fieldset>

          <Fieldset legend="Signatures">
            <p>
              By signing, you agree that you have read and agree to the loan
              terms set above. Upon signing, the loan will be automatically sent
              to {borrowerName} at address <strong>{loanData.borrower}</strong>.
            </p>

            <Row size={2}>
              <Column>
                <p>
                  <strong>Borrower</strong> ({borrowerName})
                </p>
                <AcceptedIcon />
              </Column>

              <Column>
                <p>
                  <strong>Lender</strong> ({ownName})
                </p>
                {loanData.status === '1' && <AcceptedIcon />}
              </Column>
            </Row>
          </Fieldset>

          <FormActions>
            {loanData.status === '0' ? (
              <>
                <LinkButton to="/loaned">Cancel</LinkButton>

                <Button primary onClick={() => acceptLoan(loanData, loanIndex)}>
                  Sign & Send
                </Button>
              </>
            ) : (
              <LinkButton to="/loaned">Return</LinkButton>
            )}
          </FormActions>
        </div>
      </FormContainer>
    </Layout>
  )
}
