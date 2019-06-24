// @flow
import React, { useState, useEffect } from 'react'
import { getOwnAccount } from 'services/Mainframe'
import { useBorrowerLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'
import Layout from 'ui/Layouts/default'

export default function Borrowed() {
  const [ownAccount, setOwnAccount] = useState()

  useEffect(() => {
    getOwnAccount().then(setOwnAccount)
  }, [])

  const loans = useBorrowerLoans(ownAccount)

  return (
    <Layout title="Borrowed">
      <h1>Borrowed Page</h1>
      <LoansTable loans={loans} />
    </Layout>
  )
}
