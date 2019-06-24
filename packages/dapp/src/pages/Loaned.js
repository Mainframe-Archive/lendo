// @flow
import React from 'react'
import {useOwnAccount} from 'services/Mainframe'
import { useLendedLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'
import Layout from 'ui/Layouts/default'

export default function Loaned () {
  const ownAccount = useOwnAccount()
  const loans = useLendedLoans(ownAccount)

  return (
    <Layout title="Loaned">
      <LoansTable loans={loans} />
    </Layout>
  )
}
