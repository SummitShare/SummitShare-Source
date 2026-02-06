'use client';

import React, { useState, useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import WalletStatus from '@/features/walletStatus';

export default function ConnectWalletPrompt() {
   const { address } = useAccount();
   const [showLoader, setShowLoader] = useState(false);

   useEffect(() => {
      if (address) {
         setShowLoader(true);
      }
   }, [address]);

   return (
      <div>
         {!address ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
               <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-center">
                     Connect Your Wallet
                  </h2>
                  <p className="mb-6 text-gray-600 text-center">
                     Please connect your wallet to continue.
                  </p>
                  <div className="flex justify-center">
                     <ConnectKitButton />
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex flex-col items-center gap-4">
               {showLoader && (
                  <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
               )}
               <p className="text-green-600 text-center">
                  Your connected address: <WalletStatus />
               </p>
            </div>
         )}
      </div>
   );
}
