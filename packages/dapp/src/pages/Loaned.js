// @flow
import React from 'react'
import { useOwnAccount, useLendedLoans } from 'services/LoanService'
import Layout from 'ui/Layouts/default'
import LoanStatus from 'ui/LoanStatus'
import formatNumber from 'util/formatNumber'
import { Link } from 'react-router-dom'
import Table from 'ui/Table'

export default function Loaned() {
  const ownAccount = useOwnAccount()
  const lendedLoans = useLendedLoans(ownAccount)

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
                <Link to={`/view-contract/lended/${key}`}>View contract</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
