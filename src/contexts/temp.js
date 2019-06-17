import React, { Component } from 'react'
import MainframeSDK from '@mainframe/sdk'
// import styled from 'styled-components'
import Web3 from 'web3'
import { abi } from '../abi'
// import '../App.css'

// const provider = ethers.getDefaultProvider('kovan')
const contractAddress = '0x9D6427182e601Ba96eECcc28872aa93f90C58762'
// const privateKey = '0x218CB65C69887CA18EAED478FA319BBE579DDB25759E23CA959BFE3D4BA6E51B'

// const wallet = new ethers.Wallet(privateKey, provider)
// const contract = new ethers.Contract(address, abi, wallet)

// const Container = styled.View`
//   flex: 1;
//   flex-direction: row;
//   width: 300px;
//   height: 300px;
//   background-color: #262626;
// `;

export default class App extends Component {

  constructor() {
    super()

    this.state = {
      sdk: new MainframeSDK(),
      contacts: [],
      loans: [],
      showMsg: false,
      selectedContact: '',
      amount: 0,
      isLoading: false,
    }

    this.state.web3 = new Web3(this.state.sdk.ethereum.web3Provider)
    // this.state.ethers = new ethers.providers.Web3Provider(this.state.sdk.ethereum.web3Provider)
  }

  async componentDidMount() {
    //readSmartContract function
    const contacts = await this.state.sdk.contacts.selectContacts()
    const ownAccount = await this.state.sdk.ethereum.getDefaultAccount()

    // const wallet = new ethers.Wallet(privateKey, this.state.ethers)
    const contract = new this.state.web3.eth.Contract(abi, contractAddress)
    // const wallet = new ethers.Wallet(privateKey, this.state.ethers)
    // const contractEthers = new ethers.Contract(contractAddress, abi, wallet)

    //change the way contacts array is made
    const newContacts = contacts.map(contact => ({ ethAddress: contact.data.profile.ethAddress, name: contact.data.profile.name }))

    console.log('contract', contract)
    const loans = await contract.methods.getLoanAtAddress(ownAccount).call()
    // const loansEthers = await contractEthers.getLoanAtAddress(ownAccount)
    console.log('loans', loans)
    console.log('agora vai porra', Object.entries(loans))
    this.setState({ loans: Object.entries(loans), contacts: newContacts })
  }

  newLoan = () => {
    this.setState({ showNewLoan: true })
  }

  createNewLoanContract = async (a, b) => {
    a.preventDefault()
    this.setState({isLoading: true})
    console.log('call smart contract')
    console.log('this.state', this.state.selectedContact)
    // const wallet = new ethers.Wallet(privateKey, this.state.ethers)
    const ownAccount = await this.state.sdk.ethereum.getDefaultAccount()
    const contract = new this.state.web3.eth.Contract(abi, contractAddress)
    // const wallet = new ethers.Wallet(privateKey, this.state.ethers)
    // const contractEthers = new ethers.Contract(contractAddress, abi, wallet)

    // console.log('amount', this.state.amount)
    // console.log('selectedContact', this.state.selectedContact)
    const writeLoan = await contract.methods.requestLoanRob(this.state.selectedContact, this.state.amount).send({from: ownAccount})
    // const writeLoanEthers = await contractEthers.requestLoanRob(this.state.selectedContact, this.state.amount)
    this.setState({isLoading: false, showNewLoan: false, showMsg: true})

    setTimeout(() => { this.setState({showMsg: false}) }, 3000);
    console.log('writeLoan', writeLoan)
  }

  selectContact = (option) => {
    console.log('option', option.target.value)
    this.setState({selectedContact: option.target.value})
  }

  render() {
    console.log('this.state', this.state)
    if (this.state.isLoading) return (<div>Loding...</div>)
    return (
      <div className="App">
        <h1>{this.state.showMsg ? "Loan created successfully!" : ''}</h1>
        <h1>My Loans</h1>
        {this.state.loans.map(loan => (
          <div></div>
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
              <div className="row-item">
                <div>Payment Plan</div>
                <input label="Amount" type="text" disabled value={"Monthly"} />
              </div>
              <div className="row-item">
                <div>Interest Rate</div>
                <input label="Amount" type="text" disabled value={"1.27%"} />
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
