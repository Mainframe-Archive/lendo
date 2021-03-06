const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = process.env.MNEMONIC

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      network_id: '*',
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://kovan.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
          0,
          2,
        )
      },
      network_id: 42,
    },
  },

  compilers: {
    solc: {
      version: '0.5.8',
    },
  },
}
