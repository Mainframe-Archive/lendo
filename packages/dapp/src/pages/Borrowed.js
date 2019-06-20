// @flow
import React, { useState, useEffect } from 'react'
import { sdk } from 'services/Mainframe'

import { useBorrowerLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'
export default function Borrowed() {

  const [ownAccount, setOwnAccount] = useState()
  useEffect(() => {
    const initializeOwnAccount = async () => {
      const ownAccount = await sdk.ethereum.getDefaultAccount()
      setOwnAccount(ownAccount)
    }
    initializeOwnAccount()
  }, [])

  const loans = useBorrowerLoans(ownAccount)

  return (
    <div>
      <h1>Borrowed Page</h1>
      {LoansTable(loans)}
    </div>
  )
}
