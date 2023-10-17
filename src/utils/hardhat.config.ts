import { HardhatUserConfig } from 'hardhat/config';
import dotenv from 'dotenv';
import path from 'path';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();

// Network Config
const networkConfig = {
  sepolia: {
    url: process.env.SEPOLIA_URL || '',
    accounts: [process.env.SEPOLIA_KEY || ''],
  },
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.21',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: networkConfig, // Moved inside the config object
  paths: {
    artifacts: path.join(__dirname, 'artifacts'), // Moved inside the config object
  },
};

export default config;
