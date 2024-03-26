/*
Category: Blockchain Interaction Layer
Purpose: Contains functions to estimate the gas price and the gas limit for transactions
*/

import { ethers } from "ethers";

export const getGasPrice = async (provider : ethers.providers.Provider) : Promise<ethers.BigNumber> => {
    const gasPrice = await provider .getGasPrice();
    // Optionally, adjust gasPrice here based on your strategy (e.g., increase by a certain percentage for faster confirmations)
    return gasPrice;
};

export const estimateGasLimit = async (transaction : ethers.utils.Deferrable <ethers.providers.TransactionRequest>, provider : ethers.providers.Provider) : Promise <ethers.BigNumber> => {
  // Adjust the transaction object as necessary before estimating gas
  const estimatedGasLimit = await provider.estimateGas(transaction);
  // Add a buffer to the estimated gas limit to account for unexpected execution paths
  return estimatedGasLimit.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100));
};