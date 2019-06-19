# Contract setup

## Overview 

This project uses ZeppelinOS for managing contract deployment/upgrading. Since DAI has only support for Kovan Testnet, we always use the `kovan` network configuration on `truffle-config.js`.

For local testing we use `ganache` or `ganache-cli` with a dummy ERC20 contract pretending to be a DAI instance. For our smart contract it doesn't matter because internally it just accepts an ETH address at initialization time and treats it as the base ERC20 contract address.

> The following instructions are working as of June/2019.

## Testing on Kovan testnet

Assuming you are using a web3-enabled browser:

1. Get some Kovan ETH by writting your ETH address as a message at https://gitter.im/kovan-testnet/faucet

2. Exchange test ETH for test DAI at: https://eth2dai.com/instant

3. You can confirm that you received your testnet DAI at etherscan: https://kovan.etherscan.io/token/0xc4375b7de8af5a38a93548eb8453a498222c4ff2

For contract deployment from scratch:

1. Make sure you have your seed words for `kovan` wallet exported as an environment variable called `MNEMONIC`; it is used by `truffle-config.js` to execute operations on the blockchain.

```shell
$ export MNEMONIC="here comes you seed words..."
```

2. Create a zos session so you don't have to pass the network parameters for the next commands (optional):

```shell
$ npx zos session --network kovan
```

3. Deploy the updated logic contract:

```shell
$ npx zos push
```

4. Create the proxy contract pointing to the logic contract address:

```shell
$ npx zos create Loan --init initialize --args "0xc4375b7de8af5a38a93548eb8453a498222c4ff2"
```

The initialization parameter refers to the DAI contract address on Kovan testnet.

If you are just upgrading the existing contract with a new logic contract:

```shell
$ npx zos update Loan
```
