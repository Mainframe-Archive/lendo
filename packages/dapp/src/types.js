export type NewLoanData = {
  dueDate: number,
  selectedContact: string,
  loanName: string,
  loanAmount: string,
  interest: string,
}

export type LoanData = {
  name: string,
  amount: string,
  dueDate: string,
  lender: string,
  borrower: string,
  status: string,
}
