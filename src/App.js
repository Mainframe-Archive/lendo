import React, { Component } from 'react'
import logo from './logo.svg'
import MainframeSDK from '@mainframe/sdk'
// import styled from 'styled-components'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { abi } from './abi'
import './App.css'

// const provider = ethers.getDefaultProvider('kovan')
const contractAddress = '0x9D6427182e601Ba96eECcc28872aa93f90C58762'
const privateKey = '0x218CB65C69887CA18EAED478FA319BBE579DDB25759E23CA959BFE3D4BA6E51B'

// const wallet = new ethers.Wallet(privateKey, provider)
// const contract = new ethers.Contract(address, abi, wallet)

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

    this.state = {
      sdk: new MainframeSDK(),
      contacts: [],
      loans: [],
      showNewLoan: false,
      selectedContact: '',
      amount: 0
    }

    this.state.ethers = new ethers.providers.Web3Provider(this.state.sdk.ethereum.web3Provider)
  }

  async componentDidMount() {
    //readSmartContract function
    const contacts = await this.state.sdk.contacts.selectContacts()
    const ownAccount = await this.state.sdk.ethereum.getDefaultAccount()

    const wallet = new ethers.Wallet(privateKey, this.state.ethers)
    const contract = new ethers.Contract(contractAddress, abi, wallet)

    //change the way contacts array is made
    const newContacts = contacts.map(contact => ({ ethAddress: contact.data.profile.ethAddress, name: contact.data.profile.name }))
    console.log('ownAccount', ownAccount)

    console.log('contract', contract)
    const loans = await contract.getLoanAtAddress(ownAccount)
    console.log('loans', loans[3])
    this.setState({ loans, contacts: newContacts })
  }

  newLoan = () => {
    this.setState({ showNewLoan: true })
  }

  createNewLoanContract = async (a, b) => {
    a.preventDefault()
    console.log('call smart contract')
    console.log('this.state', this.state.selectedContact)
    const wallet = new ethers.Wallet(privateKey, this.state.ethers)
    const contract = new ethers.Contract(contractAddress, abi, wallet)

    console.log('amount', this.state.amount)
    console.log('selectedContact', this.state.selectedContact)
    const writeLoan = await contract.requestLoanRob(this.state.selectedContact, this.state.amount)
    console.log('writeLoan', writeLoan)
  }

  selectContact = (option) => {
    console.log('option', option.target.value)
    this.setState({selectedContact: option.target.value})
  }

  render() {
    console.log('this.state', this.state)
    return (
      <div className="App">
        <h1>{this.state.loanStatus === 'completed' ? "You have a new Loan" : ''}</h1>
        <h1>My Loans</h1>
        {this.state.loans.map(loan => (
          <div>loan</div>
        ))}
        {this.state.showNewLoan ? (
          <form style={{ justifyContent: 'center' }}>
            <div className="form-container">
              <div className="row-item" style={{marginTop: '15px'}}>
                <div>Lender</div>
                <select value={this.state.selectedContact} onChange={this.selectContact}>
                <option key={'None'} value={''}>None</option>
                  {this.state.contacts.map(contact => <option key={contact.name} value={contact.ethAddress}>{contact.name}</option>)}
                </select>
              </div>
              <div className="row-item">
                <div>Amount</div>
                <input label="Amount" type="text" value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})} />
              </div>
              <button onClick={this.createNewLoanContract}> Send Loan </button>
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
