/*
Category: Blockchain Interaction Layer
Purpose: Provides utility functions for initializing and interacting with smart contracts on the blockchain using ethers.js. Includes contract address management and ABI imports for seamless integration within the application.
*/

import { ethers } from 'ethers';
import { initializeDevWallet, initializeUserWallet } from './walletInit';

import EventOrganizerServiceABI from '../artifacts/contracts/EventOrganizerService.sol/EventOrganizerService.json';
import MuseumABI from '../artifacts/contracts/Museum.sol/Museum.json';
import ArtifactNFTABI from '../artifacts/contracts/ArtifactNFT.sol/ArtifactNFT.json';
import EventEscrowABI from '../artifacts/contracts/EventEscrow.sol/EventEscrow.json';
import MUSDCABI from '../artifacts/contracts/MUSDC.sol/MUSDC.json';
import ExhibitNFTABI from '../artifacts/contracts/ExhibitNFT.sol/ExhibitNFT.json';
import DonationsABI from '../artifacts/contracts/Donations.sol/Donations.json';

export const CONTRACT_ADDRESSES = {
   EventOrganizerServiceAdd: '0x24AFbcd71Ea88275f0d302706796ADE47DD0e923',
   MUSDCAdd: '0xCF8cCFDb3Ff1E711ad0291360C8C84E3fADd5351',
   MuseumAdd: '0x45eB3C8d2aedE8cDbfC7c71d36d2510183D0Cf09',
   exhibitId: '0xb3ca7af3573eabc87c41b42a4ec7d764ddfb6a6d',
   eventId: 'LLE0',
   EscrowAdd: '0xd5f98017f2fdb45b07c8b4d6eb73e447993e2400',
};

// Export ABIs directly
export const ABIs = {
   EventOrganizerServiceABI,
   MuseumABI,
   ArtifactNFTABI,
   EventEscrowABI,
   MUSDCABI,
   ExhibitNFTABI,
   DonationsABI,
};

export const contracts = {
   getEventOrganizerService: () => {
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         CONTRACT_ADDRESSES.EventOrganizerServiceAdd,
         EventOrganizerServiceABI as ethers.ContractInterface, // `unknown` operator is used to dodge a type issue which can also be solved by removing the outer tags of the contract ABI
         wallet
      );
   },

   getArtifactNFT: (address: string) => {
      // Accepting dynamic address for flexibility
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         address, // Using a dynamic address for ArtifactNFT instances
         ArtifactNFTABI as ethers.ContractInterface,
         wallet
      );
   },

   getEventEscrow: () => {
      const { signer } = initializeUserWallet();
      return new ethers.Contract(
         CONTRACT_ADDRESSES.EscrowAdd,
         EventEscrowABI as ethers.ContractInterface,
         signer
      );
   },

   getMUSDC: () => {
      const { signer } = initializeUserWallet();
      return new ethers.Contract(
         CONTRACT_ADDRESSES.MUSDCAdd,
         MUSDCABI as ethers.ContractInterface,
         signer
      );
   },

   getMuseum: () => {
      const { signer } = initializeUserWallet();
      return new ethers.Contract(CONTRACT_ADDRESSES.MuseumAdd, MuseumABI, signer);
   },

   getExhibitNFT: (address: string) => {
      // Accepting dynamic address for flexibility
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         address, // Using a dynamic address for ArtifactNFT instances
         ExhibitNFTABI as ethers.ContractInterface,
         wallet
      );
   },

   getDonations: (address: string) => {
      const { wallet } = initializeDevWallet();
      return new ethers.Contract(
         address,
         DonationsABI as unknown as ethers.ContractInterface,
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
      // Add a buffer to the estimated gas (e.g., 20% more)
      return BigInt(Math.floor(Number(estimatedGas) * 1.2));
   } catch (error) {
      console.error(`Error estimating gas for ${method}:`, error);
      throw error;
   }
}
