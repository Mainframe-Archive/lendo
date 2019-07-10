// @flow
import React from 'react'
import Layout from 'ui/Layouts/default'
import FormContainer from 'ui/FormContainer'
import FormTitle from 'ui/FormTitle'
import Fieldset from 'ui/Fieldset'
import { format } from 'date-fns'
import { useLendedLoanById, useOwnAccount } from '../services/LoanService'
import type { LoanData } from 'types'

const humanReadableDate = (date: Date): string => format(date, 'MM/DD/YYYY')

export default function ViewContract({ match }) {
  const loanIndex = match.params.loanId
  const ownAccount = useOwnAccount()
  // const loanData: LoanData = useLendedLoanById(ownAccount, loanIndex)
  const loanData: LoanData = {
    name: 'Eu quero café',
    amount: 10000,
    dueDate: 1562986800,
    lender: '0x440f05c6e359e3a4ab8765e492d9ae2d66c913b4',
    borrower: '0xe3f0d0ecfd7f655f322a05d15c996748ad945561',
    status: 1,
  }

  return (
    <Layout title={`Contract #${loanIndex}`}>
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
          </Fieldset>
        </div>
      </FormContainer>
    </Layout>
  )
}
