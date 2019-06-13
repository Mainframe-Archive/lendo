import React, { Component } from 'react'
import logo from './logo.svg'
import MainframeSDK from '@mainframe/sdk'
// import styled from 'styled-components'
import { ethers } from 'ethers'
// import { abi } from './abi'
import './App.css'

const abi = '';
const provider = ethers.getDefaultProvider('kovan')
const address = '0xFB23eC4FA01e228c2da6a1F3563F4Ba71Ffb1604'
const privateKey =
  '0x218CB65C69887CA18EAED478FA319BBE579DDB25759E23CA959BFE3D4BA6E51B'

const wallet = new ethers.Wallet(privateKey, provider)
// const contract = new ethers.Contract(address, abi, wallet)

// var sendPromise = contract.setValue('Hello World')



// const Container = styled.View`
//   flex: 1;
//   flex-direction: row;
//   width: 300px;
//   height: 300px;
//   background-color: #262626;
// `;

class App extends Component {
  constructor() {
    super()
    // this.sdk = new MainframeSDK()
    this.state = {
      contacts: [],
      loans: [],
      showNewLoan: false,
    }
  }

  componentDidMount() {
    //readSmartContract function
  }

  newLoan = () => {
    this.setState({ showNewLoan: true })
  }

  createNewLoanContract = (a, b) => {
    a.preventDefault()
    console.log('call smart contract')
    // const sendPromise = contract.setValue('newLoan')

    // sendPromise.then(function(transaction) {
    //   console.log(transaction)
    // })
  }

  render() {
    // console.log('abi', abi)
    return (
      <div className="App">
        <h1>My Loans</h1>
        {this.state.loans.map(loan => (
          <div>loan</div>
        ))}
        {this.state.showNewLoan ? (
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
              <button onClick={this.callSmartContract}> Send Invite </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={this.newLoan}>
            {' '}
            New Loan{' '}
          </button>
        )}
      </div>
    )
  }
}

export default App
