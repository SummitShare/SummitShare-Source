import { defineConfig } from '@wagmi/cli';
import { TaskArguments } from 'hardhat/types';
import dotenv from 'dotenv';

// Import the entire ABI.json file
import ABIArray from './ABI.json'; 

dotenv.config();

// Explicitly type the network configuration
const networkConfig: any = {
  sepolia: {
    url: process.env.SEPOLIA_URL,
    accounts: [process.env.SEPOLIA_KEY],
    deployArgs: async (args: TaskArguments) => {
      return {
        swapRouter: args['swap-router'],
        usdt: args.usdt,
        usdc: args.usdc,
        rs2: args.rs2,
        rs3: args.rs3,
        ps: args.ps,
      };
    },
  },
};


const controllerABI = ABIArray as unknown as controllerABI;


// Define the complete configuration
const config = {
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'Controller',
      abi: controllerABI,
    },
  ],
  plugins: [],
  networks: networkConfig,
};

export default defineConfig(config);
