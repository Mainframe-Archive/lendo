// @flow
import React, { useState, useEffect } from 'react'
import { getOwnAccount } from 'services/Mainframe'
import { useLendedLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'
import Layout from 'ui/Layouts/default'

export default function Loaned () {
  const [ownAccount, setOwnAccount] = useState()

  useEffect(() => {
    getOwnAccount().then(setOwnAccount)
  }, [])

  const loans = useLendedLoans(ownAccount)

  return (
    <Layout title="Loaned">
      <LoansTable loans={loans} />
    </Layout>
  )
}
