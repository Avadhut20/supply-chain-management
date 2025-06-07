

module.exports = {
  networks: {
    // Local development network (Ganache)
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache default RPC port
      network_id: "*",       // Match any network ID
    },
  },

  // Mocha test framework options
  mocha: {
    // timeout: 100000
  },

  // Solidity compiler configuration
  compilers: {
    solc: {
      version: "0.8.21",      // Use specific Solidity version
      // Optional settings
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  },

  // Truffle DB (disabled by default)
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
