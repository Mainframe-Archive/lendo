// @flow
import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import formatNumber from '../../util/formatNumber'

const TableContainer = styled.div`
  background-color: #f9f9f9;
`
const PayRow = styled.td`
  color: blue;
  cursor: pointer;
`

type Props = {
  loans: Array<any>,
  loaned?: boolean,
  onAccept?: (loan: any, key: number) => void,
}

export default function LoansTable({
  loans,
  loaned = false,
  onAccept = () => {},
}: Props) {
  const statusArray = ['pending', 'rolling', 'done']

  const returnStatus = (loaned, status) => {
    if (loaned && status === 'pending') return "Accept!"
    if (loaned && status === 'rolling') return ""
    if (loaned && status === 'done') return ""
    else return "Pay Now!"
  }

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
              <td>{format(loan.dueDate, 'MM/DD/YYYY')}</td>
              <td>{formatNumber(loan.amount)} DAI</td>
              <td>{statusArray[loan.status]}</td>
              <PayRow onClick={() => onAccept(loan, key)}>
                {returnStatus(loaned, statusArray[loan.status])}}
              </PayRow>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}
