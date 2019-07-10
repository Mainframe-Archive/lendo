// @flow
import React from 'react'
import {
  approveDAITransfer,
  approveLoan,
  useLendedLoans,
  useOwnAccount,
} from 'services/LoanService'
import Layout from 'ui/Layouts/default'
import LoanStatus from 'ui/LoanStatus'
import formatNumber from 'util/formatNumber'
import { Link } from 'react-router-dom'
import Table from 'ui/Table'

export default function Loaned() {
  const ownAccount = useOwnAccount()
  const lendedLoans = useLendedLoans(ownAccount)

  async function acceptLoan(loan, index) {
    console.log('loan', loan)
    console.log('key', index)
    console.log('Number(loan.amount)', Number(loan.amount))

    console.log(
      'approving contract Address - 3rd party to make a transfer in my name',
    )

    approveDAITransfer(loan, ownAccount)
      .then(() => {
        console.log('dai transfer approved!')
        return approveLoan(index, ownAccount)
      })
      .then(() => {
        console.log('finished both contracts successfully')
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  return (
    <Layout title="Loaned">
      <Table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Borrower</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lendedLoans.map((loan, key) => (
            <tr key={key}>
              <td>
                <LoanStatus code={loan.status} />
              </td>
              <td>{loan.name}</td>
              <td>{loan.borrower}</td>
              <td>{formatNumber(loan.amount)} DAI</td>
              <td>
                <Link
                  to="/"
                  onClick={event => {
                    event.preventDefault()
                    acceptLoan(loan, key)
                  }}>
                  See loan
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
