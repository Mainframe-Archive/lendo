// @flow
import React, { useState } from 'react'
import Layout from 'ui/Layouts/default'
import Button from 'ui/Button'
import Fieldset from 'ui/Fieldset'
import FormActions from 'ui/FormActions'
import FormContainer from 'ui/FormContainer'
import FormTitle from 'ui/FormTitle'
import LinkButton from 'ui/LinkButton'
import { Column, Row } from '@morpheus-ui/core'
import {
  getContactByAddress,
  useBorrowedLoanById,
  useOwnAccount,
  approveDAITransfer,
  payDebt,
} from 'services/LoanService'
import type { LoanData } from 'types'
import styled from 'styled-components'
import { fromWei } from 'util/formatNumber'
import { calculateInterestWithAmounts } from 'util/calculateSimpleInterest'
import { format } from 'date-fns'
import AcceptedIcon from '../ui/AcceptedIcon'

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

export default function ViewBorrowedContract({ match, history }: Props) {
  const loanIndex = match.params.loanId
  const ownName = 'Satoshi Nakamoto'
  const ownAccount = useOwnAccount()
  const loanData: LoanData = useBorrowedLoanById(ownAccount, loanIndex)
  const [lenderName, serLenderName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  function payLoan(loan: LoanData, index) {
    setIsLoading(true)
    setError(null)

    approveDAITransfer(loan.expectedAmount, ownAccount)
      .then(() => {
        console.log('dai transfer approved payDebt!')
        return payDebt(index, ownAccount)
      })
      .then(() => {
        console.log('finished both contracts successfully - PayDebt')
        history.push('/loaned')
      })
      .catch(error => {
        console.log('error', error)
        setError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (loanData) {
    getContactByAddress(loanData.lender).then(lender => {
      if (lender) {
        serLenderName(lender.data.profile.name)
      }
    })

  } else {
    return (
      <Layout title="Contract: ">
        <h1>Loading</h1>
      </Layout>
    )
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
              <Button onClick={() => payLoan(loanData, loanIndex)} primary>
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
                  <p>{lenderName}</p>
                  <p>{loanData.borrower}</p>
                </EthAddress>
              </Column>

              <Column>
                <EthAddress>
                  <h3>"Borrower"</h3>
                  <p>{ownName}</p>
                  <p>{loanData.lender}</p>
                </EthAddress>
              </Column>
            </Row>
          </Fieldset>

          <Fieldset legend="Loan terms">
            <p>
              {ownName} agrees to loan {lenderName}{' '}
              <strong>{fromWei(loanData.amount)} DAI</strong> upon signing
              this contract. {lenderName} agrees to pay {ownName} back loan
              amount plus APR of{' '}
              <strong>{calculateInterestWithAmounts(loanData.amount, loanData.expectedAmount)}%</strong>. The total
              payback amount is <strong>{fromWei(loanData.expectedAmount)} DAI</strong>{' '}
              due on {humanReadableDate(loanData.dueDate * 1000)}.
            </p>
          </Fieldset>

          <Fieldset legend="Signatures">
            <p>
              By signing, you agree that you have read and agree to the loan
              terms set above. Upon signing, the loan will be automatically sent
              to {lenderName} at address <strong>{loanData.borrower}</strong>.
            </p>

            <Row size={2}>
              <Column>
                <p>
                  <strong>Borrower</strong> ({ownName})
                </p>
                <AcceptedIcon />
              </Column>

              <Column>
                <p>
                  <strong>Lender</strong> ({lenderName})
                </p>
                {loanData.status === "1" && (
                  <AcceptedIcon />
                )}
              </Column>
            </Row>
          </Fieldset>

          <FormActions>
            <LinkButton to="/borrowed">Return</LinkButton>
            {loanData.status === "1" && (
              <Button onClick={ () => payLoan(loanData, loanIndex)}>Pay Loan</Button>
            )}
          </FormActions>
        </div>
      </FormContainer>
    </Layout>
  )
}
