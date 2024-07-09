import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { contracts, CONTRACT_ADDRESSES } from '@/utils/dev/contractInit';
import { handleContractError } from '@/utils/dev/handleContractError';
import { EventEscrowComponentProps } from '@/utils/dev/typeInit';
import useExhibit from '@/lib/useGetExhibitById';
import { initializeUserWallet } from '@/utils/dev/walletInit';
import Buttons from '@/app/components/button/Butons';

const EventEscrowComponent = ({ userAddress }: any) => {
  // Hardcoded exhibit ID for demo
  const exhibitId = CONTRACT_ADDRESSES.exhibitId;
  const hardcodedEscrowAddress = CONTRACT_ADDRESSES.EscrowAdd;

  // State for managing component data and UI
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [distributionSuccessful, setDistributionSuccessful] =
    useState<boolean>(false);
  const [distributionFailed, setDistributionFailed] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (status) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);
  // Fetch exhibit details
  const exhibit = useExhibit(exhibitId);

  // Function to fetch escrow details from EventOrganizerService contract
  const fetchEscrowDetails = useCallback(async () => {
    if (!exhibit) {
      setStatus('No matching exhibit found.');
      return;
    }
    try {
      const { provider, signer } = initializeUserWallet();
      const escrowContract = contracts
        .getEventEscrow(hardcodedEscrowAddress)
        .connect(signer);

      // const shares = await escrowContract.getShares();
      // const beneficiaries = await escrowContract.getBeneficiaries();

      // setEscrowDetails({
      //     id : hardcodedEscrowAddress,
      //     shares,
      //     beneficiaries
      // });
      setStatus('');
    } catch (error) {
      setStatus('Failed to fetch escrow details.');
      console.error(error);
    }
  }, [exhibit, hardcodedEscrowAddress]);

  // Effect hook to fetch escrow details when the component mounts or exhibitId changes
  useEffect(() => {
    fetchEscrowDetails();
  }, [fetchEscrowDetails]);

  // Function to distribute funds from the escrow contract
  const distributeFunds = async () => {
    setIsLoading(true);

    //  Check if escrow details are available
    // if (!escrowDetails || !escrowDetails.id) {
    //     setStatus('No EventEscrow address found for the exhibit.');
    //     setIsLoading(false);
    //     return;
    // }

    // Attempting to distribute funds
    try {
      const { signer } = initializeUserWallet();
      const escrowContract = contracts
        .getEventEscrow(hardcodedEscrowAddress)
        .connect(signer);

      setStatus('Initiating fund distribution...');
      const gasLimit = escrowContract.estimateGas.distributePayments();
      const tx = await escrowContract.distributePayments({ gasLimit });
      await tx.wait(4);
      setStatus('Funds distributed successfully.');
      setDistributionSuccessful(true);

      // Refresh escrow details post-distribution
      fetchEscrowDetails();
    } catch (error: any) {
      console.error('Error in distributing funds:', error);
      if (error.message.includes('No funds to distribute')) {
        setStatus('No funds available to distribute.');
      } else if (error.code === 4001) {
        // User denied transaction signature
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
        className={`bg-green-500 border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-10 transition-transform duration-500 border-green-300 ${
          isVisible ? 'translate-y-0 bottom-5' : 'translate-y-full -bottom-20'
        }`}
      >
        {status && <p className="text-sm text-white font-semibold">{status}</p>}
      </div>

      {distributionSuccessful && (
        <div
          className={`bg-green-500 border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-10 transition-transform duration-500 border-green-300 ${
            isVisible ? 'translate-y-0 bottom-5' : 'translate-y-full -bottom-20'
          }`}
        >
          <p className="text-sm text-white font-semibold">
            Funds distributed successfully!
          </p>
        </div>
      )}
    </>

    // <div className="flex flex-col gap-2">
    //   {distributionSuccessful ? (
    //     <div>
    //       <p>Funds distributed successfully!</p>
    //       {/* Actions post-distribution */}
    //     </div>
    //   ) : (
    //     <button
    //       className="w-full p-2 mt-5 font-bold bg-orange-500 rounded-lg text-white"
    //       onClick={distributeFunds}
    //       disabled={isLoading}
    //     >
    //       Distrbute
    //     </button>
    //   )}
    //   {/* Display current status */}
    //   {status && <p className="text-sm font-semibold">{status}</p>}
    // </div>
  );
};
//     return (
//         <div className='flex flex-col gap-2'>
//             {distributionSuccessful ? (
//                 <div>
//                     <p>Funds distributed successfully!</p>
//                     {/* Actions post-distribution */}
//                 </div>
//             ) : (
//                 <button className="w-[15%] p-4 text-3xl bg-orange-500 rounded-tl-2xl text-white fixed bottom-0 right-0 shadow-md"   onClick={distributeFunds}
//                 disabled={isLoading} ><BanknotesIcon/></button>

//             )}
//             {/* Display current status */}
//             {status && <p className='text-sm font-semibold'>{status}</p>}
//             {/* Display Escrow Details */}
//             {escrowDetails && (
//                 <div>
//                     <p>Escrow Address: {escrowDetails.id}</p>
//                     <p>Shares: {JSON.stringify(escrowDetails.shares)}</p>
//                     {/* Display Beneficiaries and Payments */}
//                     {escrowDetails.beneficiaries.map((beneficiary: any, index: number) => (
//                         <div key={index}>
//                             <p>Beneficiary Address: {beneficiary.id}</p>
//                             {beneficiary.paymentsReceived.map((payment: any, idx: number) => (
//                                 <div key={idx}>
//                                     <p>Amount: {ethers.utils.formatEther(payment.amount)}</p>
//                                     <p>Transaction Hash: {payment.transactionHash}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

export default EventEscrowComponent;
