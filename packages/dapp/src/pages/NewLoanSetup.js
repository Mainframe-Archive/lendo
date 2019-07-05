// @flow
import React from 'react'
import Layout from 'ui/Layouts/default'
import FormContainer from 'ui/FormContainer'
import LoanForm from 'ui/LoanForm'
import type { NewLoanData } from 'types'

type Props = {
  history: any
}

export default function NewLoanSetup ({ history }: Props) {
  return (
    <Layout title="New loan">
      <FormContainer>
        <LoanForm onSubmit={(data: NewLoanData) => {
          history.push('/new-loan/review', data)
        }} />
      </FormContainer>
    </Layout>
  )
}
