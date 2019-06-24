// @flow
import React, { useState } from 'react'
import Layout from 'ui/Layouts/default'
import LoanForm from 'ui/LoanForm'
import { contract, useOwnAccount } from 'services/LoanService'

export default function NewLoan () {
  const [showNewLoan, setShowNewLoan] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [showMsg, setShowMsg] = useState(false)

  const ownAccount = useOwnAccount()

  if (loadingStatus) return <div>Loading...</div>

  return (
    <Layout title="New loan">
      <h1>{showMsg ? 'Loan created successfully!' : ''}</h1>
      {showNewLoan ? (
        <LoanForm onSubmit={(data) => {
          setLoadingStatus(true)

          if (contract) {
            contract.methods
            .requestLoan(data.selectedContact, data.loanName, data.loanAmount, data.dueDate)
            .send({ from: ownAccount })
            .then(() => {
              setShowMsg(true)
              setShowNewLoan(false)
              setLoadingStatus(false)
            })
            .catch(() => {
              // error msg
            })
            .finally(() => {
              window.setTimeout(() => {
                setShowMsg(false)
              }, 3000)
            })
          }
        }} />
      ) : (
        <button type="button" onClick={() => setShowNewLoan(true)}>
          New Loan
        </button>
      )}
    </Layout>
  )
}
