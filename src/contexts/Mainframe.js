import React from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'

export const sdk = new MainframeSDK()
export const web3 = new Web3(sdk.ethereum.web3Provider)

export default React.createContext()
