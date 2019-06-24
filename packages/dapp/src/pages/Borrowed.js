// @flow
import React from 'react'
import { useOwnAccount, useBorrowerLoans } from 'services/LoanService'
import LoansTable from 'ui/LoansTable'
import Layout from 'ui/Layouts/default'

export default function Borrowed() {
  const ownAccount = useOwnAccount()
  const loans = useBorrowerLoans(ownAccount)

  return (
    <Layout title="Borrowed">
      <LoansTable loans={loans} />
    </Layout>
  )
}
