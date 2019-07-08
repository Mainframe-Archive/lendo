// @flow
import React from 'react'

type Props = {
  code: number
}

const statuses = ['Pending', 'Open', 'Done']

export default function LoanStatus({ code }: Props) {
  return statuses[code]
}
