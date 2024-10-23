import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
   contracts,
   CONTRACT_ADDRESSES,
   estimateGas,
} from '@/utils/dev/contractInit';
import { handleContractError } from '@/utils/dev/handleContractError';
import { EventEscrowComponentProps } from '@/utils/dev/typeInit';
import useExhibit from '@/lib/useGetExhibitById';
import Buttons from '@/app/components/button/Butons';
import { Transition } from '@headlessui/react';

const EventEscrowComponent = ({ userAddress }: any) => {
   // Hardcoded exhibit ID for demo
   const exhibitId = CONTRACT_ADDRESSES.exhibitId;

   // State for managing component data and UI
   const [status, setStatus] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [distributionSuccessful, setDistributionSuccessful] =
      useState<boolean>(false);
   const [distributionFailed, setDistributionFailed] = useState<boolean>(false);
   const [isVisible, setIsVisible] = useState(false);
   const [notBeneficiaryError, setNotBeneficiaryError] = useState<boolean>(false);
   const [txHash, setTxHash] = useState<string | null>(null);

   useEffect(() => {
      if (status) {
         setIsVisible(true);
         const timer = setTimeout(() => {
            setIsVisible(false);
         }, 2000); // 2 seconds

         return () => clearTimeout(timer);
      }
   }, [status]);

   // fetch and store exhibit details
   const exhibit = useExhibit(exhibitId);

   // Function to distribute funds from the escrow contract
   const distributeFunds = async () => {
      setIsLoading(true);

      try {
         const escrowContract = contracts.getEventEscrow();

         // Step 3: Estimating gas
         setStatus('Estimating gas for distribution...');
         const gasLimitDistribute = await estimateGas(
            escrowContract,
            'distributePayments',
            []
         );

         // Step 4: Distributing funds
         setStatus('Distributing funds...');
         const tx = await escrowContract.distributePayments({
            gasLimit: gasLimitDistribute,
         });

         setStatus('Initiating fund distribution...');
         await new Promise((resolve) => setTimeout(resolve, 4000));

         // Step 2: Indexing addresses
         setStatus('Indexing beneficiary addresses...');
         await new Promise((resolve) => setTimeout(resolve, 4000));

         setTxHash(tx.hash);
         await tx.wait(4);

         setStatus('Funds distributed successfully.');
         setDistributionSuccessful(true);
      } catch (error: any) {
         console.error('Error in distributing funds:', error);

         if (error.message.includes('Not a beneficiary')) {
            setStatus('You do not have permission to distribute funds.');
            setNotBeneficiaryError(true);
         } else if (error.message.includes('No funds to distribute')) {
            setStatus('No funds available to distribute.');
         } else if (error.code === 4001) {
            setStatus('Transaction cancelled by user.');
         } else {
            const friendlyMessage = handleContractError(error);
            setStatus(friendlyMessage);
         }
         setDistributionFailed(true);
      }
      setIsLoading(false);
   };

   // Render component UI
   return (
      <>
         <Buttons type="primary" size="large" onClick={distributeFunds}>
            Distribute
         </Buttons>

         {/* Display current status */}
         <div
            className={`${
               notBeneficiaryError ? 'bg-red-500' : 'bg-green-500'
            } border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-10 transition-transform duration-500 ${
               notBeneficiaryError ? 'border-red-300' : 'border-green-300'
            } ${
               isVisible
                  ? 'translate-y-0 bottom-5'
                  : 'translate-y-full -bottom-20'
            }`}
         >
            {status && (
               <p className="text-sm text-white font-semibold">{status}</p>
            )}
         </div>

         {distributionSuccessful && txHash && (
            <div
               className={`bg-green-500 border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-10 transition-transform duration-500 border-green-300 ${
                  isVisible
                     ? 'translate-y-0 bottom-5'
                     : 'translate-y-full -bottom-20'
               }`}
            >
               <p className="text-sm text-white font-semibold">
                  Funds distributed successfully! View transaction hash{' '}
                  <a
                     href={`https://sepolia.etherscan.io/tx/${txHash}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline text-white"
                  >
                     here
                  </a>
                  .
               </p>
            </div>
         )}
      </>
   );
};

export default EventEscrowComponent;
