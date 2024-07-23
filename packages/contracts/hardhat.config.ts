import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
dotenv.config();

// You should replace these values with your own node URL and private keys

const SEPOLIA_RPC_URL = process.env.RPC_URL;
const accounts = process.env.PRIVATE_KEYS?.split(',');


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  defender:{
    apiKey: process.env.DEFENDER_KEY as string,
    apiSecret: process.env.DEFENDER_SECRET as string,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts,
      chainId: 11155420, // Sepolia chain ID
      gasPrice: 4000000000,
    },
  },

  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    rst: true,
    enabled: true,
    coinmarketcap: "603bd12e-d2f3-4a9f-8c82-d5e346d9d482",
  },

};


export default config;
