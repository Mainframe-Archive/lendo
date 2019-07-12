// @flow
import React from 'react'
import { useOwnAccount, useBorrowedLoans } from 'services/LoanService'
import formatNumber from 'util/formatNumber'
import { Link } from 'react-router-dom'
import Layout from 'ui/Layouts/default'
import LoanStatus from 'ui/LoanStatus'
import Table from 'ui/Table'

export default function Borrowed() {
  const ownAccount = useOwnAccount()
  const borrowedLoans = useBorrowedLoans(ownAccount)

  return (
    <Layout title="Borrowed">
      <Table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Lender</th>
            <th>Amount Initial</th>
            <th>Amount to pay</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {borrowedLoans.map((loan, key) => (
            <tr key={key}>
              <td>
                <LoanStatus code={loan.status} />
              </td>
              <td>{loan.name}</td>
              <td>{loan.lender}</td>
              <td>{formatNumber(loan.amount)} DAI</td>
              <td>{formatNumber(loan.expectedAmount)} DAI</td>
              <td>
                <Link to={`/view-contract/borrowed/${key}`}>View contract</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
