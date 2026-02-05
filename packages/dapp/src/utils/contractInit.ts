/*
Category: Blockchain Interaction Layer
Purpose: Provides utility functions for initializing and interacting with smart contracts on the blockchain using ethers.js. Includes contract address management and ABI imports for seamless integration within the application.
*/

import { ethers } from 'ethers';
import { getChainEnv, initializeDevWallet, initializeUserWallet } from './walletInit';

import EventOrganizerServiceABI from './abis/EventOrganizerService.json';
import MuseumABI from './abis/Museum.json';
import ArtifactNFTABI from './abis/ArtifactNFT.json';
import EventEscrowABI from './abis/EventEscrow.json';
import ExhibitNFTABI from './abis/ExhibitNFT.json';
import USDTABI from './abis/usdtoptimism.json';
import MUSDCABI from './abis/MUSDC.json';
import DonationsABI from './abis/Donations.json';

const DEV_CONFIG = {
   addresses: {
      EventOrganizerServiceAdd: '0x24AFbcd71Ea88275f0d302706796ADE47DD0e923',
      MUSDCAdd: '0xCF8cCFDb3Ff1E711ad0291360C8C84E3fADd5351',
      MuseumAdd: '0x45eB3C8d2aedE8cDbfC7c71d36d2510183D0Cf09',
      exhibitId: '0xb3ca7af3573eabc87c41b42a4ec7d764ddfb6a6d',
      eventId: 'LLE0',
      EscrowAdd: '0xd5f98017f2fdb45b07c8b4d6eb73e447993e2400',
   },
   stableToken: {
      address: '0xCF8cCFDb3Ff1E711ad0291360C8C84E3fADd5351',
      abi: MUSDCABI,
   },
};

const PROD_CONFIG = {
   addresses: {
      EventOrganizerServiceAdd: '0x662388C92915aD4be269452E7069d4AC56b07e82',
      USDTAdd: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      MuseumAdd: '0x3935e5BED378aCeD49655b3E1fA8c0e68550fbaa',
      EscrowAdd: '0xf38bfab9369664537c0dd3c56deed489c530e6e7',
      exhibitId: '0xbf41a8ff480edc10f5d65a9bf7ccc8b36ec1dd38',
      eventId: 'LLE1',
   },
   stableToken: {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      abi: USDTABI,
   },
};

const ACTIVE_CONFIG = getChainEnv() === 'dev' ? DEV_CONFIG : PROD_CONFIG;

export const CONTRACT_ADDRESSES = ACTIVE_CONFIG.addresses;

// Export ABIs directly
export const ABIS = {
   EventOrganizerServiceABI,
   MuseumABI,
   ArtifactNFTABI,
   EventEscrowABI,
   ExhibitNFTABI,
   USDTABI,
   MUSDCABI,
   DonationsABI,
};

const getStableTokenContract = (
   signerOrProvider: ethers.Signer | ethers.providers.Provider
) =>
   new ethers.Contract(
      ACTIVE_CONFIG.stableToken.address,
      ACTIVE_CONFIG.stableToken.abi as ethers.ContractInterface,
      signerOrProvider
   );

export const contracts = {
   getEventOrganizerService: () => {
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         CONTRACT_ADDRESSES.EventOrganizerServiceAdd,
         EventOrganizerServiceABI as ethers.ContractInterface,
         wallet
      );
   },

   getArtifactNFT: (address: string) => {
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         address,
         ArtifactNFTABI as ethers.ContractInterface,
         wallet
      );
   },

   getEventEscrow: () => {
      if (typeof window === 'undefined') {
         throw new Error('initializeUserWallet cannot be used server-side');
      }

      const { signer } = initializeUserWallet();
      return new ethers.Contract(
         CONTRACT_ADDRESSES.EscrowAdd,
         EventEscrowABI as ethers.ContractInterface,
         signer
      );
   },

   // Stable token helpers (USDT in prod, MUSDC in dev)
   getUSDT: () => {
      const { wallet } = initializeDevWallet();
      return getStableTokenContract(wallet);
   },

   getUSDTU: () => {
      if (typeof window === 'undefined') {
         throw new Error('initializeUserWallet cannot be used server-side');
      }

      const { signer } = initializeUserWallet();
      return getStableTokenContract(signer);
   },

   // Legacy alias retained for compatibility
   getMUSDC: () => {
      const { wallet } = initializeDevWallet();
      return getStableTokenContract(wallet);
   },

   getMuseum: () => {
      if (typeof window === 'undefined') {
         throw new Error('initializeUserWallet cannot be used server-side');
      }

      const { signer } = initializeUserWallet();
      return new ethers.Contract(
         CONTRACT_ADDRESSES.MuseumAdd,
         MuseumABI as ethers.ContractInterface,
         signer
      );
   },

   getExhibitNFT: (address: string) => {
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         address,
         ExhibitNFTABI as ethers.ContractInterface,
         wallet
      );
   },

   getDonations: (address: string) => {
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         address,
         DonationsABI as ethers.ContractInterface,
         wallet
      );
   },
};

export async function estimateGas(
   contract: ethers.Contract,
   method: string,
   args: any[]
): Promise<bigint> {
   try {
      const estimatedGas = await contract.estimateGas[method](...args);
      return BigInt(Math.floor(Number(estimatedGas) * 1.2));
   } catch (error) {
      console.error(`Error estimating gas for ${method}:`, error);
      throw error;
   }
}
