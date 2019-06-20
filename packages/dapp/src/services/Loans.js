import { useState, useEffect } from 'react'
import { sdk, web3, contract } from 'services/Mainframe'

export function useBorrowerLoans(borrowerAddress) {
  const [loans, setLoans] = useState([])

  useEffect(() => {
    const getLoansByBorrower_ = async () => {
      try {
        const newLoans = []
        const loansArrayLength = await contract.methods
          .loanCountByBorrower(borrowerAddress)
          .call()

        //change for paralell requests in the future - ordenation needed
        for (let i = 0; i < loansArrayLength; i++) {
          const loanIndex = await contract.methods
            .loansByBorrower(borrowerAddress, i)
            .call()

          const currentLoan = await contract.methods
          .loans(loanIndex)
          .call()

          newLoans.push(currentLoan)
        }
        setLoans(newLoans)
      } catch (err) {
        console.log('err', err)
      }
    }
   if (borrowerAddress) getLoansByBorrower_()
  }, [borrowerAddress])
  return loans
}
