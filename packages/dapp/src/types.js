export type Address = string

export type NewLoanData = {
  dueDate: number,
  selectedContact: {
    name: string,
    ethAddress: Address
  },
  loanName: string,
  loanAmount: string,
  interest: string,
}

export type LoanData = {
  name: string,
  amount: string,
  dueDate: string,
  lender: Address,
  borrower: Address,
  status: string,
}

