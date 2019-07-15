// @flow
import React, { useState } from 'react'
import formatNumber from 'util/formatNumber'
import { Link } from 'react-router-dom'
import Layout from 'ui/Layouts/default'
import LoanStatus from 'ui/LoanStatus'
import Table from 'ui/Table'
import type { LoanData } from 'types'
import {
  useOwnAccount,
  useBorrowedLoans,
  approveDAITransfer,
  payDebt,
  web3
} from 'services/LoanService'

export default function Borrowed() {
  const ownAccount = useOwnAccount()
  const borrowedLoans = useBorrowedLoans(ownAccount)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  console.log('borrowedLoans', borrowedLoans)

  function payLoan(loan: LoanData, index) {
    setIsLoading(true)
    setError(null)

    approveDAITransfer(loan.expectedAmount, ownAccount)
      .then(() => {
        console.log('dai transfer approved payDebt!')
        return payDebt(index, ownAccount)
      })
      .then(() => {
        console.log('finished both contracts successfully - PayDebt')
        // history.push('/loaned')
      })
      .catch(error => {
        console.log('error', error)
        setError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

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
              <td>{web3.utils.fromWei(loan.amount)} DAI</td>
              <td>{web3.utils.fromWei(loan.expectedAmount)} DAI</td>
              <td onClick={() => payLoan(loan, key)}>{'Pay Loan'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
