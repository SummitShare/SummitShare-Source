/*
Category: Blockchain Interaction Layer
Purpose: Wallet initialization for the configured chain environment
*/

import { ethers } from 'ethers';

interface JsonRpcConnectionInfo {
   url: string;
   skipFetchSetup?: boolean;
   headers?: Record<string, string>;
}

type ChainEnv = 'dev' | 'prod';

const resolveChainEnv = (): ChainEnv => {
   const raw = (
      process.env.NEXT_PUBLIC_CHAIN_ENV ??
      process.env.CHAIN_ENV ??
      'prod'
   ).toLowerCase();
   if (raw === 'dev' || raw === 'development') return 'dev';
   return 'prod';
};

const CHAIN_CONFIG: Record<
   ChainEnv,
   { rpcUrl?: string; privateKey?: string; chainId: number; name: string }
> = {
   dev: {
      rpcUrl: process.env.RPC_URL,
      privateKey: process.env.DEV_PRIVATE_KEY,
      chainId: 11155420,
      name: 'op-sepolia',
   },
   prod: {
      rpcUrl: process.env.PROD_RPC_URL,
      privateKey: process.env.PROD_PRIVATE_KEY,
      chainId: 10,
      name: 'optimism',
   },
};

export const getChainEnv = (): ChainEnv => resolveChainEnv();

// Initialize provider and signer from user's wallet
export const initializeUserWallet = () => {
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();
   return { provider, signer };
};

// Initialize a server-side wallet for the active chain
export const initializeDevWallet = () => {
   const env = resolveChainEnv();
   const { rpcUrl, privateKey, chainId, name } = CHAIN_CONFIG[env];

   if (!privateKey || !rpcUrl) {
      throw new Error('Missing environment variables');
   }

   const connection: JsonRpcConnectionInfo = {
      url: rpcUrl,
      skipFetchSetup: true,
      headers: {
         'Content-Type': 'application/json',
      },
   };

   const provider = new ethers.providers.StaticJsonRpcProvider(connection, {
      chainId,
      name,
   });

   const wallet = new ethers.Wallet(privateKey, provider);
   return { provider, wallet };
};

// Test Wallets - Should have Sepolia/OP Sepolia
export const testWallets = [
   process.env.araragi,
   process.env.shinobu,
   process.env.hanekawa,
   process.env.oshino,
];
