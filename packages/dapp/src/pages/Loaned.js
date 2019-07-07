// @flow
import React from 'react'
import { useLendedLoans, useOwnAccount } from 'services/LoanService'
import LoansTable from 'ui/LoansTable'
import Layout from 'ui/Layouts/default'

export default function Loaned () {
  const ownAccount = useOwnAccount()
  const loans = useLendedLoans(ownAccount)

  return (
    <Layout title="Loaned">
      <LoansTable loans={loans} loaned />
    </Layout>
  )
}
