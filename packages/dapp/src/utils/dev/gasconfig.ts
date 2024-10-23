/**
 * Applies a gas configuration to a transaction overrides object.
 *
 * @param overrides - The transaction overrides object to apply the gas configuration to.
 * @param maxFeePerGas - The maximum fee per gas (in Gwei) to use for the transaction.
 * @param maxPriorityFeePerGas - The maximum priority fee per gas (in Gwei) to use for the transaction.
 * @returns The updated transaction overrides object with the gas configuration applied.
 * @throws Error if the provided gas values are invalid or cannot be parsed.
 */
import { providers, utils } from 'ethers';

export const applyGasConfig = (
   overrides: providers.TransactionRequest = {},
   maxFeePerGas?: string,
   maxPriorityFeePerGas?: string
): providers.TransactionRequest => {
   try {
      // Set the maximum fee per gas if provided
      if (maxFeePerGas) {
         try {
            const maxFeePerGasInWei = utils.parseUnits(maxFeePerGas, 'gwei');
            overrides.maxFeePerGas = utils.hexlify(maxFeePerGasInWei);
         } catch (error: any) {
            throw new Error(
               `Invalid maxFeePerGas value: ${maxFeePerGas}. ${error!.message}`
            );
         }
      }

      // Set the maximum priority fee per gas if provided
      if (maxPriorityFeePerGas) {
         try {
            const maxPriorityFeePerGasInWei = utils.parseUnits(
               maxPriorityFeePerGas,
               'gwei'
            );
            overrides.maxPriorityFeePerGas = utils.hexlify(
               maxPriorityFeePerGasInWei
            );
         } catch (error: any) {
            throw new Error(
               `Invalid maxPriorityFeePerGas value: ${maxPriorityFeePerGas}. ${
                  error!.message
               }`
            );
         }
      }

      // Handle gas estimation errors
      overrides.gasLimit = utils.hexlify(1140000); // Set a high gas limit to avoid "cannot estimate gas" errors - average of max gas spent see `/contracts/readme.md` for gas chart

      return overrides;
   } catch (error: any) {
      throw new Error(`Failed to apply gas configuration: ${error!.message}`);
   }
};
