'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import EventEscrowComponent from '@/features/eventEscrowComponent';
import { RequireWeb3 } from '@/features/Web3Boundary';
import { ApolloWrapper } from '../apolloWrapper';

function FundDistributionContent() {
   const { address, isConnecting, isReconnecting } = useAccount();

   if (isConnecting || isReconnecting) {
      return <div aria-busy="true" />;
   }

   return <EventEscrowComponent userAddress={address} />;
}

const FundDistributionPage = () => {
   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold mb-6">Fund Distribution Dashboard</h1>
         <div className="bg-white rounded-lg shadow-lg p-6">
            <RequireWeb3 fallback={<div aria-busy="true" />}>
               <ApolloWrapper>
                  <FundDistributionContent />
               </ApolloWrapper>
            </RequireWeb3>
         </div>
      </div>
   );
};

export default FundDistributionPage;
