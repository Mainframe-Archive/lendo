# Wallet Setup

## TDLR;

Assuming you are using a web3-enabled browser:

1. Get some Kovan ETH by writting your ETH address as a message at https://gitter.im/kovan-testnet/faucet

2. You can confirm that you received your testnet DAI at etherscan: https://kovan.etherscan.io/token/0xc4375b7de8af5a38a93548eb8453a498222c4ff2

3. Exchange ETH for DAI at: https://eth2dai.com/instant

## Smart contract deployment

This project uses ZeppelinOS for managing contract deployment/upgrading. Since DAI has only support for Kovan Testnet, we always use the `kovan` network configuration on `truffle-config.js`.

### Contract upgrade

1. Make sure you have your seed words for `kovan` wallet exported as an environment variable called `MNEMONIC`; it is used by `truffle-config.js` to execute operations on the blockchain.

```shell
$ export MNEMONIC = "here comes you seed words..."
```

2. Create a zos session so you don't have to pass the network parameters for the next commands (optional):

```shell
$ npx zos session --network kovan
```

3. Deploy the updated logic contract:

```shell
$ npx zos push
```

4. Update the proxy contract with the new logic contract address:

```shell
$ npx zos update --network kovan
```

## Overview

DAI is available only on Kovan testnet, so we need to first get some testnet ETH and then convert it to testnet DAI.

The following instructions are working as of June/2019.

### Get some Kovan ETH

See: https://medium.com/singapore-blockchain-dapps/how-to-get-testcoin-from-ethereum-kovan-testnetwork-85c466d5b869

### Get some Kovan DAI

See: https://kauri.io/article/9ef53381beb14100a2af9817e22bd812/dai-token-guide-for-developers
