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

export interface ErrorCategory {
   message: string;
   isUserActionable: boolean;
   action?: string;
}

// Predefined error messages for common scenarios
export const ERROR_MESSAGES = {
   // Wallet and Connection Errors
   NO_PROVIDER: {
      message: 'Wallet connection required.',
      isUserActionable: true,
      action: 'Please connect your wallet to continue.',
   },

   // Balance Errors
   INSUFFICIENT_BALANCE: {
      message: 'Insufficient USDT balance.',
      isUserActionable: true,
      action: 'Please ensure you have enough USDT tokens to purchase the ticket.',
   },

   // Ticket-Related Errors
   TICKET_VALIDATION_FAILED: {
      message: 'Ticket validation failed.',
      isUserActionable: false,
      action: 'Please contact support@summitshare.co. Error code: VAL_001',
   },
   TICKET_RECORD_FAILED: {
      message: 'Ticket purchase completed but record creation failed.',
      isUserActionable: false,
      action:
         'Please contact support@summitshare.co with your transaction hash. Error code: REC_001',
   },

   // System Errors
   SYSTEM_ERROR: {
      message: 'System configuration error.',
      isUserActionable: false,
      action: 'Please contact support@summitshare.co. Error code: SYS_001',
   },
} as const;

export const handleContractError = (error: any): ErrorCategory => {
   // Default error with support contact
   const defaultError: ErrorCategory = {
      message: 'An unexpected error occurred.',
      isUserActionable: false,
      action: 'Please contact support@summitshare.co for assistance.',
   };

   // Environment Variables Error
   if (error.message?.includes('Missing environment variables')) {
      return {
         message: 'System configuration error.',
         isUserActionable: false,
         action: 'Please contact support@summitshare.co. Error code: ENV_001',
      };
   }

   // User-actionable errors
   if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
      return {
         message: 'Insufficient funds to complete this transaction.',
         isUserActionable: true,
         action: 'Please ensure you have enough USDT and ETH for gas fees.',
      };
   }

   if (
      error.code === 4001 ||
      error.message?.includes('user rejected transaction')
   ) {
      return {
         message: 'Transaction rejected.',
         isUserActionable: true,
         action: 'Please try the transaction again if you would like to proceed.',
      };
   }

   // Network-related errors
   if (
      error.code === ethers.errors.NETWORK_ERROR ||
      error.message?.includes('wallet not connected')
   ) {
      return {
         message: 'Network connection issue detected.',
         isUserActionable: true,
         action: 'Please check your wallet connection and network status.',
      };
   }

   // Gas-related errors
   if (
      error.code === 'UNPREDICTABLE_GAS_LIMIT' ||
      error.code === ethers.errors.CALL_EXCEPTION
   ) {
      return {
         message: 'Transaction execution failed.',
         isUserActionable: true,
         action:
            'Please try again with a higher gas limit or contact support@summitshare.co if the issue persists.',
      };
   }

   // Contract deployment errors
   if (error.message?.includes('contract not deployed')) {
      return {
         message: 'Contract not available on current network.',
         isUserActionable: true,
         action:
            'Please switch to Optimism network or contact support@summitshare.co.',
      };
   }

   // Transaction pricing errors
   if (error.message?.includes('transaction underpriced')) {
      return {
         message: 'Transaction fee too low.',
         isUserActionable: true,
         action: 'Please increase your gas price and try again.',
      };
   }

   // Nonce errors
   if (error.message?.includes('nonce too high')) {
      return {
         message: 'Transaction sequence error (high nonce).',
         isUserActionable: false,
         action: 'Please contact support@summitshare.co. Error code: NONCE_001',
      };
   }

   if (error.message?.includes('nonce too low')) {
      return {
         message: 'Transaction sequence error (low nonce).',
         isUserActionable: true,
         action:
            'Please wait for your previous transaction to complete or reset your wallet.',
      };
   }

   // Token approval errors
   if (error.message?.includes('ERC20: insufficient allowance')) {
      return {
         message: 'Token approval required.',
         isUserActionable: true,
         action: 'Please approve the token spending and try again.',
      };
   }

   // Return default error if no specific case matches
   return defaultError;
};
