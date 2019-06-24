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
  loans: Array<any>
}

export default function LoansTable({loans}: Props) {
  return (
    <TableContainer>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Borrower</th>
            <th>Lender</th>
            <th>Due Date</th>
            <th>Name</th>
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
              <td key={key}>{(new Date(loan.dueDate)).toString()}</td>
              <td key={key}>{loan.amount}</td>
              <td key={key}>{loan.status}</td>
              <PayRow>Pay now!</PayRow>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}
