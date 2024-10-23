import React, { useState, useEffect, ReactNode } from 'react';
import Buttons from '@/app/components/button/Butons';
import WalletStatus from '@/functonality/walletStatus';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import useExhibit from '@/lib/useGetExhibitById';
import { CONTRACT_ADDRESSES } from '@/utils/dev/contractInit';
import { TicketPurchaseUIProps } from '@/utils/dev/frontEndInterfaces';
import { useAccount, useConnect } from 'wagmi';

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
               disabled={false}
               //@ts-ignore
               style={{
                  border: '2px solid white', // White edges
                  backgroundColor: 'transparent', // Optional: make the background transparent
                  color: 'white', // Text color
                  padding: '16px 32px', // Increased padding for a bigger button
                  fontSize: '1.5rem', // Increased font size for better visibility
                  borderRadius: '8px', // Rounded corners
                  transition: 'background-color 0.3s, transform 0.3s', // Smooth transitions
                  cursor: 'pointer', // Pointer cursor on hover
                  display: 'flex', // Use flexbox to align text
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                  textAlign: 'center', // Center text
               }}
               onMouseEnter={(e: {
                  currentTarget: {
                     style: { backgroundColor: string; transform: string };
                  };
               }) => {
                  e.currentTarget.style.backgroundColor =
                     'rgba(255, 255, 255, 0.2)'; // Change background on hover
                  e.currentTarget.style.transform = 'scale(1.05)'; // Slightly enlarge button on hover
               }}
               onMouseLeave={(e: {
                  currentTarget: {
                     style: { backgroundColor: string; transform: string };
                  };
               }) => {
                  e.currentTarget.style.backgroundColor = 'transparent'; // Reset background
                  e.currentTarget.style.transform = 'scale(1)'; // Reset size
               }}
            >
               {buttonConfig.text}
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
                                       Gas Fees Estimate: {estimatedGasFees} USDT
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
                     <XMarkIcon className="h-6 w-6" />
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
                        <button
                           onClick={closeSuccessMessage}
                           className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors"
                        >
                           Got it, thanks!
                        </button>
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
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                     <p className="text-sm text-gray-700">
                        Thank you for your purchase! The exhibit will be available
                        when the countdown ends.
                     </p>
                  </div>
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
                        The exhibit will be available when the countdown ends.
                     </span>
                  )}
               </p>
            )}
         </div>
      </>
   );
};

export default TicketPurchaseUI;
