/**
 * This utility function is designed to handle and interpret errors that occur during
 * interactions with Ethereum smart contracts through the ethers.js library. It aims to
 * translate various error codes and messages into user-friendly text, making it easier
 * for users to understand the nature of the error and potential steps to resolve it.
 * This function is vital for improving the user experience in dApps by providing
 * clearer error messages instead of cryptic error codes.
 *
 * @param {any} error - The error object received from ethers.js or custom error scenarios.
 * @returns {string} A user-friendly message describing the error.
 */

import { ethers } from 'ethers';

export const handleContractError = (error: any): string => {
  let message = 'An unexpected error occurred. Please try again.';

  // Checking for insufficient funds
  if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
    message = 'You have insufficient funds to complete this transaction.';
  }
  // Gas estimation failed
  else if (
    error.code === 'UNPREDICTABLE_GAS_LIMIT' ||
    error.code === ethers.errors.CALL_EXCEPTION
  ) {
    message =
      'Cannot estimate gas for this transaction. Please adjust the gas limit.';
  }
  // User rejected the transaction
  else if (
    error.code === 4001 ||
    (error.message && error.message.includes('user rejected transaction'))
  ) {
    message = 'Transaction was rejected by the user.';
  }
  // Network error or wallet not connected
  else if (
    error.code === ethers.errors.NETWORK_ERROR ||
    (error.message && error.message.includes('wallet not connected'))
  ) {
    message =
      'Network error or wallet not connected. Please check your connection and try again.';
  }
  // Contract not deployed to network
  else if (error.message && error.message.includes('contract not deployed')) {
    message =
      'The contract is not deployed on the current network. Please switch networks or contact support.';
  }
  // Transaction underpriced
  else if (error.message && error.message.includes('transaction underpriced')) {
    message =
      'Transaction underpriced. Increase your gas price or gas limit and try again.';
  }
  // Transaction replacement underpriced
  else if (
    error.message &&
    error.message.includes('replacement transaction underpriced')
  ) {
    message =
      'Replacement transaction underpriced. Increase the gas price for speeding up or cancelling the transaction.';
  }
  // Nonce too high
  else if (error.message && error.message.includes('nonce too high')) {
    message =
      'Nonce too high. Please reset your account nonce or contact support.';
  }
  // Nonce too low
  else if (error.message && error.message.includes('nonce too low')) {
    message =
      'Nonce too low. This transaction may replace or cancel a previous one. Please increase the nonce or wait for confirmation.';
  }

  // Add more error checks if needed
  return message;
};
