import React, { useState, useEffect, ReactNode } from 'react';
import Buttons from '@/components/button/Butons';
import WalletStatus from '@/features/walletStatus';
import Image from 'next/image';
import { X } from 'lucide-react';
import Link from 'next/link';
import useExhibit from '@/lib/useGetExhibitById';
import { CONTRACT_ADDRESSES } from '@/utils/contractInit';
import { TicketPurchaseUIProps } from '@/types/frontend';
import { useAccount } from 'wagmi';

const TicketPurchaseUI: React.FC<TicketPurchaseUIProps> = ({
   // User and Authentication
   userAddress,
   setHasTicket,
   hasTicket,

   // Button States and Controls
   buttonType,
   setButtonType,
   buttonText,
   buttonConfig,
   isProcessing,

   // Status and Messages
   status,
   isVisible,
   showSuccessMessage,
   closeSuccessMessage,
   isValidating,

   // Purchase State
   purchaseSuccessful,
   isCountdownOver,

   // Popup and Interaction States
   isPopupVisible,
   togglePopup,
   isHovering,
   setIsHovering,

   // Price and Gas Information
   estimatedGasFees,
   isEstimating,
   ticketPriceWithToken,
   ticketPriceFormatted,
   calculateTotalPrice,

   // Core Functions
   purchaseTicket,
}) => {
   const { isConnected } = useAccount();

   // Determine button text based on wallet connection
   const getButtonText = () => {
      if (isProcessing) return 'Processing...';
      if (!isConnected) return 'Connect Wallet';
      return buttonConfig.text;
   };

   const exhibitId = CONTRACT_ADDRESSES.exhibitId;
   const exhibit = useExhibit(exhibitId);

   return (
      <>
         <div className="transform scale-200">
            <Buttons
               //@ts-ignore
               type={buttonConfig.type}
               size="large"
               onClick={buttonConfig.action}
               disabled={isValidating}
               //@ts-ignore
               style={{
                  border: '2px solid white',
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '16px 32px',
                  fontSize: '1.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s',
                  cursor: isValidating ? 'wait' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  opacity: isValidating ? '0.7' : '1',
               }}
               onMouseEnter={(e: {
                  currentTarget: {
                     style: { backgroundColor: string; transform: string };
                  };
               }) => {
                  if (!isValidating) {
                     e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.2)';
                     e.currentTarget.style.transform = 'scale(1.05)';
                  }
               }}
               onMouseLeave={(e: {
                  currentTarget: {
                     style: { backgroundColor: string; transform: string };
                  };
               }) => {
                  if (!isValidating) {
                     e.currentTarget.style.backgroundColor = 'transparent';
                     e.currentTarget.style.transform = 'scale(1)';
                  }
               }}
            >
               {isValidating ? (
                  <div className="flex items-center justify-center space-x-2">
                     <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                     >
                        <circle
                           className="opacity-25"
                           cx="12"
                           cy="12"
                           r="10"
                           stroke="currentColor"
                           strokeWidth="4"
                        />
                        <path
                           className="opacity-75"
                           fill="currentColor"
                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                     </svg>
                     <span>Loading...</span>
                  </div>
               ) : (
                  buttonConfig.text
               )}
            </Buttons>
         </div>

         {isPopupVisible && !purchaseSuccessful && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                  <button
                     className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
                     onClick={togglePopup}
                  >
                     ✕
                  </button>
                  <h2 className="text-lg font-semibold mb-4 text-center">
                     {exhibit?.exhibitDetails && exhibit.exhibitDetails.length > 0
                        ? exhibit.exhibitDetails[0].name
                        : 'No Exhibit Name Available'}
                  </h2>

                  <div className="mb-4 text-center">
                     <label className="block text-sm font-medium text-gray-700">
                        Ticket Price:
                     </label>
                     <p className="font-bold flex justify-center items-center">
                        {ticketPriceWithToken}
                        <Image
                           src="https://optimistic.etherscan.io/token/images/tether_32.png"
                           alt="Tether"
                           width={16}
                           height={16}
                           className="ml-2"
                        />
                     </p>
                  </div>

                  <div className="mb-4 text-center">
                     <label className="block text-sm font-medium text-gray-700">
                        Quantity:
                     </label>
                     <p>1x</p>
                  </div>

                  <div className="mb-4 text-center">
                     <label className="block text-sm font-medium text-gray-700">
                        Address to:
                     </label>
                     <WalletStatus />
                  </div>

                  <div className="mb-4 text-center relative">
                     <label className="block text-sm font-medium text-gray-700">
                        Total Price:
                     </label>
                     <p className="font-bold flex justify-center items-center">
                        {calculateTotalPrice()} USDT
                        <Image
                           src="https://optimistic.etherscan.io/token/images/tether_32.png"
                           alt="Tether"
                           width={16}
                           height={16}
                           className="ml-2"
                        />
                     </p>

                     <div className="relative inline-block">
                        <small
                           className="cursor-pointer text-black rounded-full border border-black bg-white px-2 py-1 inline-block leading-none text-center text-xs"
                           onMouseEnter={() => setIsHovering(true)}
                           onMouseLeave={() => setIsHovering(false)}
                        >
                           ?
                        </small>
                        {isHovering && (
                           <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 sm:w-350 bg-white text-gray-800 text-sm border border-gray-300 rounded-lg shadow-lg z-10 p-3">
                              <div className="font-bold mb-2">Breakdown:</div>
                              <div className="space-y-1">
                                 <div>
                                    <strong>
                                       Ticket Price: {ticketPriceFormatted} USDT
                                    </strong>
                                 </div>
                                 <div>
                                    <strong>
                                       Gas Fees Estimate: {estimatedGasFees} ETH
                                    </strong>{' '}
                                 </div>
                                 <div className="text-xs mt-2">
                                    (Gas fees are used to process the purchase
                                    on-chain and do not go to us.)
                                 </div>
                              </div>
                           </div>
                        )}{' '}
                     </div>
                     <style jsx>{`
                        @media (min-width: 640px) {
                           .group:hover > div {
                              width: 350px;
                           }
                        }
                     `}</style>
                  </div>

                  <Buttons type="primary" size="large" onClick={purchaseTicket}>
                     {buttonText}
                  </Buttons>

                  <div className="text-center">
                     <Link
                        href="/help"
                        className="text-sm text-orange-600 hover:underline"
                     >
                        Need help? Visit our Help Page
                     </Link>
                  </div>
               </div>
            </div>
         )}

         {/* Success Message Popup */}
         {showSuccessMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-8">
                  {/* Close Button */}
                  <button
                     onClick={closeSuccessMessage}
                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                     <X className="h-6 w-6" />
                  </button>

                  {/* Success Content */}
                  <div className="text-center space-y-4">
                     {/* Success Icon */}
                     <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <svg
                           className="w-8 h-8 text-green-500"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                           />
                        </svg>
                     </div>

                     {/* Success Message */}
                     <h3 className="text-2xl font-bold text-gray-900">
                        Ticket Purchase Successful!
                     </h3>

                     <div className="space-y-3 text-gray-600">
                        <p>
                           Thank you for your purchase! You will receive an email
                           with further details shortly.
                        </p>
                        <p>
                           Your ticket NFT will appear in the wallet you used for
                           purchase:
                           <span className="block mt-1 text-sm font-mono bg-gray-100 p-2 rounded">
                              <WalletStatus />
                           </span>
                        </p>
                        {!isCountdownOver && (
                           <p className="text-sm text-gray-500 mt-4">
                              The exhibit will be accessible when the countdown
                              ends.
                           </p>
                        )}
                     </div>

                     {/* Action Button */}
                     <div className="mt-8">
                        {isCountdownOver ? (
                           <button
                              onClick={closeSuccessMessage}
                              className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors"
                           >
                              View Exhibit
                           </button>
                        ) : (
                           <button
                              onClick={() => {
                                 closeSuccessMessage();
                                 window.location.href = '/distribution';
                              }}
                              className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors"
                           >
                              Read Insights
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Post-Purchase Notification */}
         {purchaseSuccessful && (
            <div className="fixed bottom-5 right-5 z-50">
               {isCountdownOver ? (
                  <a
                     href="https://summitshare.co/exhibit"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <Buttons type="secondary" size="large">
                        View Exhibit
                     </Buttons>
                  </a>
               ) : (
                  <Link href="/distribution">
                     <Buttons type="secondary" size="large">
                        Read Insights
                     </Buttons>
                  </Link>
               )}
            </div>
         )}

         {/* Status Message Toast */}
         <div
            className={`bg-green-500 border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-50 transition-transform duration-500 border-green-300 ${
               isVisible
                  ? 'translate-y-0 bottom-5'
                  : 'translate-y-full -bottom-20'
            }`}
         >
            {status && (
               <p className="text-sm text-white font-semibold">
                  {status}
                  {purchaseSuccessful && !isCountdownOver && (
                     <span>
                        {' '}
                        Visit the distribution page to see how funds are being
                        allocated.
                     </span>
                  )}
               </p>
            )}
         </div>
      </>
   );
};

export default TicketPurchaseUI;
