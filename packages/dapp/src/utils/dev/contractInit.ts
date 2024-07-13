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
  EventOrganizerServiceAdd: '0x844188D0E7CAfCf4183714f48150223a11AdE341',
  MUSDCAdd: '0xF4Fa9d3d03A946Ae032Ca5f94CFe11e4B33340d7',
  MuseumAdd: '0x45804953C8C7e8C261cB1269039C8CE6700D56C7',
  exhibitId: '0x57084b8165aad61281c1be0cb3f809fb9476b7a4',
  eventId: "KMGIII",
  EscrowAdd: '0xf83d61fc47ca63458bbece0cee77bab90fe4311d',
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