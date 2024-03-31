/*
Category: Blockchain Interaction Layer
Purpose: Wallet Initialisation within the dev env
*/

import { ethers } from "ethers";

export const initializeWallet = (): ethers.Wallet => {
    // Check if the RPC URL is defined
    const rpcUrl = process.env.SEPOLIA_RPC_URL; 
    if (!rpcUrl) {
        throw new Error("RPC_URL is not defined in the environment variables.");
    }

    // Initialize the provider with the RPC URL
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Check if the private key is defined
    const privateKey = process.env.DEV_PRIVATE_KEY; 
    if (!privateKey) {
        throw new Error("PRIVATE_KEY is not defined in the environment variables.");
    }

    // Create and return the wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet;
};
