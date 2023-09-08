require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;  // アカウントの秘密鍵

module.exports = {
  solidity: "0.8.17",
  networks: {
    hmvtest: {
      url: 'https://rpc.sandverse.oasys.games',
      accounts: [PRIVATE_KEY],
      chainId: 20197
    },
    opbnb: {  // BNBのopBNBテストネット
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      accounts: [PRIVATE_KEY],
      gasPrice: 20000000000,
      chainId: 5611
    },
  },
};
