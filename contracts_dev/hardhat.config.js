/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-ethers');

const { privateKey, mnemonic, evmosUrl} = require('./secrets.json');

module.exports = {
  solidity: {
    version: '0.8.4'
  },
  networks: {
    evmos: {
      url: evmosUrl,
      accounts: {mnemonic}
    }
  },
  namedAccounts: {
    deployer: 0
  },
};
