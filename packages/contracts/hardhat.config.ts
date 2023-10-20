import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    rst: true,
    enabled: true,
    coinmarketcap: "603bd12e-d2f3-4a9f-8c82-d5e346d9d482",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
