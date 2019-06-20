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
const statusArray = ['pending', 'rolling', 'done']

export default function LoansTable({loans, loaned}) {
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
            <tr>
              <td key={key}>{loan.name}</td>
              <td key={key}>{loan.borrower}</td>
              <td key={key}>{loan.lender}</td>
              <td key={key}>{Date(loan.dueDate)}</td>
              <td key={key}>{loan.amount}</td>
              <td key={key}>{statusArray[loan.status]}</td>
              <PayRow>{loaned ? "Accept!" : "Pay Now!"}</PayRow>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}
