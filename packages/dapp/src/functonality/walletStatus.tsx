import * as React from 'react';
import { useAccount } from 'wagmi';

const WalletStatus: React.FC = () => {
   const { address, isConnecting, isDisconnected } = useAccount();

   const shortenAddress = (addr: string) => {
      if (!addr) return '';
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
   };

   if (isConnecting) return <div>Connecting...</div>;
   if (isDisconnected) return <div>Disconnected</div>;

   return (
      <div className="relative group" style={{ display: 'inline-block' }}>
         <div className="bg-white text-gray-800 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium shadow-sm">
            {/* @ts-ignore */}
            {shortenAddress(address)}
         </div>
         <div
            className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max bg-white text-gray-800 text-sm border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            style={{ whiteSpace: 'nowrap' }}
         >
            {address}
         </div>
      </div>
   );
};

export default WalletStatus;
