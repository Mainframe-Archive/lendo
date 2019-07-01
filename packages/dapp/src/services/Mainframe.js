import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { loanAbi, loanAddress } from 'contracts/loan'
import { erc20Abi. erc20Address } from 'contracts/erc20'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)

export const loanContract = new web3.eth.Contract(loanAbi, loanAddress)
export const erc20Contract = new web3.eth.Contract(erc20Abi, erc20Address)

export function getOwnAccount () {
  return sdk.ethereum.getDefaultAccount()
}

export function useOwnAccount () {
  const [ownAccount, setOwnAccount] = useState()

  useEffect(() => {
    getOwnAccount().then(setOwnAccount)
  }, [])

  return ownAccount
}
