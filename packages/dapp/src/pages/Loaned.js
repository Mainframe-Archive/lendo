// @flow
import React, { useState, useEffect } from 'react'
import { sdk } from 'services/Mainframe'

import { useLendedLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'

export default function Loaned() {

  const [ownAccount, setOwnAccount] = useState()
  useEffect(() => {
    const initializeOwnAccount = async () => {
      const ownAccount = await sdk.ethereum.getDefaultAccount()
      setOwnAccount(ownAccount)
    }
    initializeOwnAccount()
  }, [])

  const loans = useLendedLoans(ownAccount)

  return (
    <div>
      <h1>Loaned Loans</h1>
      <LoansTable loans={loans} />
    </div>
  )
}
