'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import EventEscrowComponent from '@/features/eventEscrowComponent';

const FundDistributionPage = () => {
   const router = useRouter();
   const { address } = useAccount();

   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold mb-6">Fund Distribution Dashboard</h1>
         <div className="bg-white rounded-lg shadow-lg p-6">
            <EventEscrowComponent userAddress={address} />
         </div>
      </div>
   );
};

export default FundDistributionPage;
