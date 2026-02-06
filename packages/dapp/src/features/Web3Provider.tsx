'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import * as React from 'react';
import { http } from 'viem';
import { WagmiProvider, createConfig } from 'wagmi';
import { sepolia, optimismSepolia, optimism } from 'wagmi/chains';
import { customTheme } from './customTheme';

// Define the ConnectKitOptions
const connectKitOptions = {
   enforceSupportedChains: true, // Enforce the supported chains
   initialChainId: optimism.id, // Set the initial target chain
};

const config = createConfig(
   getDefaultConfig({
      appName: 'SummitShare.',
      walletConnectProjectId: process.env.WC_ID ?? 'd',
      chains: [optimism],
      transports: {
         [optimism.id]: http(`process.env.PROD_RPC_URL!`),
      },
      // Optional App Info
      appDescription: 'Pan-African Mission.',
      appUrl: 'https://SummitShare.co',
      appIcon: 'https://summitshare3.s3.eu-north-1.amazonaws.com/IMG_3157.PNG',
   })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
   return (
      <WagmiProvider config={config}>
         <QueryClientProvider client={queryClient}>
            <ConnectKitProvider
               customTheme={customTheme}
               debugMode
               options={connectKitOptions}
            >
               {children}
            </ConnectKitProvider>
         </QueryClientProvider>
      </WagmiProvider>
   );
};
