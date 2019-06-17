// @flow
import React, { useState } from 'react'
// import MainframeSDK from '@mainframe/sdk'
// import styled from 'styled-components'
// import { ethers } from 'ethers'
// import { abi } from '../abi'

// const abi = ''
// const provider = ethers.getDefaultProvider('kovan')
// const address = '0xFB23eC4FA01e228c2da6a1F3563F4Ba71Ffb1604'
// const privateKey =
//   '0x218CB65C69887CA18EAED478FA319BBE579DDB25759E23CA959BFE3D4BA6E51B'

// const wallet = new ethers.Wallet(privateKey, provider)
// const contract = new ethers.Contract(address, abi, wallet)
// const sdk = new MainframeSDK()

// const Container = styled.View`
//   flex: 1;
//   flex-direction: row;
//   width: 300px;
//   height: 300px;
//   background-color: #262626;
// `

export default function Dashboard() {
  // const [contacts, setContracts] = useState([])
  const [loans] = useState([])
  const [showNewLoan, setShowNewLoan] = useState(false)

  return (
    <div className="App">
      <h1>My Loans</h1>
      {loans.map((loan, key) => (
        <div key={key}>{loan}</div>
      ))}
      {showNewLoan ? (
        <form style={{ justifyContent: 'center' }}>
          <div className="form-container">
            <div className="row-item">
              <div>Borrower Address</div>
              <input type="text" />
            </div>
            <div className="row-item">
              <div>Amount</div>
              <input label="Amount" type="text" />
            </div>
            <button onClick={createNewLoanContract}> Send Invite </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setShowNewLoan(true)}>
          {' '}
          New Loan{' '}
        </button>
      )}
    </div>
  )
}


function createNewLoanContract(event: Event): void {
  event.preventDefault()

  // contract.setValue('newLoan').then(transaction => {
  //   console.log(transaction)
  // })
}
