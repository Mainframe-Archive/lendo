// @flow
import React from 'react'
import { useOwnAccount } from 'services/Mainframe'
import { useLendedLoans } from 'services/Loans'
import LoansTable from 'ui/LoansTable'
import Layout from 'ui/Layouts/default'
import { loanContract, erc20Contract } from 'services/Mainframe'
import { loanAddress } from 'contracts/loan'

export default function Loaned() {
  const ownAccount = useOwnAccount()
  const loans = useLendedLoans(ownAccount)

  function acceptLoan(loan, index) {
    console.log('loan', loan)
    console.log('key', index)
    console.log('Number(loan.amount)', Number(loan.amount))

    erc20Contract.methods
      .approve(loanAddress, Number(loan.amount))
      .send({ from: ownAccount })
      .then(e => {
        console.log('approving contract Address - 3rd party to make a transfer in my name')
        console.log(e)
        contract.methods
          .approveLoan(index)
          .send({ from: ownAccount })
          .then(e => {
            console.log('terminou o paranaue')
          })
      })
      .catch(error => {
        console.log('error', error)
      })
      .finally(() => {
        console.log('acabou tudo')
      })
  }

  return (
    <Layout title="Loaned">
      <LoansTable loans={loans} onAccept={acceptLoan} loaned />
    </Layout>
  )
}
