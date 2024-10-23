/*
Category: Blockchain Interaction Layer
Purpose: Wallet Initialisation within the dev env
*/

import { ethers } from 'ethers';

// Initialize provider and signer from user's wallet
export const initializeUserWallet = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return { provider, signer };
};

const devPrivateKey = process.env.PROD_PRIVATE_KEY;
const sepoliapcUrl = process.env.RPC_URL;

// Initialize developer wallet (for server-side or admin operations)
export const initializeDevWallet = () => {
  const provider = new ethers.providers.JsonRpcProvider(sepoliapcUrl);

  if (!devPrivateKey) {
    throw new Error('dev key is not defined');
  }
  const wallet = new ethers.Wallet(devPrivateKey, provider);
  return { provider, wallet };
};

// Test Wallets - Should have Sepolia/OP Sepolia
export const testWallets = [
  process.env.araragi,
  process.env.shinobu,
  process.env.hanekawa,
  process.env.oshino,
];
