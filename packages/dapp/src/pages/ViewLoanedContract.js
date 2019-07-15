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
} from 'services/LoanService'
import type { LoanData } from 'types'
import styled from 'styled-components'
import formatNumber, { fromWei } from 'util/formatNumber'
import calculateSimpleInterest, { calculateInterestWithAmounts } from 'util/calculateSimpleInterest'
import { format } from 'date-fns'

const EthAddress = styled.span`
  word-break: break-all;

  h3 {
    margin-bottom: 0;
  }

  p {
    margin: 8px 0;
  }
`

const humanReadableDate = (date: Date | number): string => format(date, 'MM/DD/YYYY')

type Props = {
  match: any,
  history: any,
}

export default function ViewLoanedContract({ match, history }: Props) {
  const loanIndex = match.params.loanId
  const ownName = 'Satoshi Nakamoto'
  const ownAccount = useOwnAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const loanData: LoanData = useLendedLoanById(ownAccount, loanIndex)
  const [borrowerName, setBorrowerName] = useState('')

  let totalDebit = 0

  if (loanData) {
    getContactByAddress(loanData.borrower).then(borrower => {
      if (borrower) setBorrowerName(borrower.data.profile.name)
    })
  } else {
    return (
      <Layout title="Contract: ">
        <h1>Loading</h1>
      </Layout>
    )
  }

  function acceptLoan(loan: LoanData, index) {
    setIsLoading(true)
    setError(null)

    approveDAITransfer(loan.amount, ownAccount)
      .then(() => {
        console.log('dai transfer approved!')
        return approveLoan(index, ownAccount)
      })
      .then(() => {
        console.log('finished both contracts successfully')
        history.push('/loaned')
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return (
      <Layout title="Approving contract">
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
            {loanData.status === "0" && (
              <Button onClick={() => acceptLoan(loanData, loanIndex)} primary>
                Retry
              </Button>
            )}

            <LinkButton to="/loaned">
              Return to loans
            </LinkButton>
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
              of the business on {humanReadableDate(loanData.dueDate * 1000)}.
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
              <strong>{fromWei(loanData.amount)} DAI</strong> upon signing
              this contract. {borrowerName} agrees to pay {ownName} back loan
              amount plus APR of{' '}
              <strong>{calculateInterestWithAmounts(loanData.amount, loanData.expectedAmount)}%</strong>. The total
              payback amount is <strong>{fromWei(loanData.expectedAmount)} DAI</strong>{' '}
              due on {humanReadableDate(loanData.dueDate*1000)}.
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
                {loanData.status === "1" && (
                  <AcceptedIcon />
                )}
              </Column>
            </Row>
          </Fieldset>

          <FormActions>
            {loanData.status === "0" ? (
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
