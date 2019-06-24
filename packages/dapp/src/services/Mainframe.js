import { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'
import { abi, contractAddress } from 'abi'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)
export const contract = new web3.eth.Contract(abi, contractAddress)

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
