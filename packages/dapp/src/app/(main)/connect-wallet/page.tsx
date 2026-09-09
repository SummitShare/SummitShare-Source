'use client';

import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import ConnectWalletPrompt from '@/utils/methods/ticketPurchase/connectModal';
import { RequireWeb3 } from '@/features/Web3Boundary';

function ConnectWalletContent() {
   const { address, isConnecting, isReconnecting } = useAccount();
   const router = useRouter();

   useEffect(() => {
      if (address && !isConnecting && !isReconnecting) {
         const timer = setTimeout(() => {
            router.push('/exhibit');
         }, 2000);

         return () => clearTimeout(timer);
      }
   }, [address, isConnecting, isReconnecting, router]);

   if (isConnecting || isReconnecting) {
      return <div aria-busy="true" />;
   }

   return <ConnectWalletPrompt />;
}

export default function ConnectWallet() {
   return (
      <div className="h-screen flex items-center justify-center">
         <RequireWeb3 fallback={<div aria-busy="true" />}>
            <ConnectWalletContent />
         </RequireWeb3>
      </div>
   );
}
