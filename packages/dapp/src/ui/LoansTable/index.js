// @flow
import React from 'react'
import styled from 'styled-components'

const TableContainer = styled.div`
  background-color: #f9f9f9;
`
const PayRow = styled.td`
  color: blue;
  cursor: pointer;
`

type Props = {
  loans: Array<any>,
  loaned: boolean
}

export default function LoansTable({loans, loaned}: Props) {
  const statusArray = ['pending', 'rolling', 'done']

  return (
    <TableContainer>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Borrower</th>
            <th>Lender</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan, key) => (
            <tr key={key}>
              <td>{loan.name}</td>
              <td>{loan.borrower}</td>
              <td>{loan.lender}</td>
              <td>{(Date(loan.dueDate))}</td>
              <td>{loan.amount}</td>
              <td>{statusArray[loan.status]}</td>
              <PayRow>{loaned ? "Accept!" : "Pay Now!"}</PayRow>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}