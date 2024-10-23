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
import ExhibitNFTABI from '../artifacts/contracts/ExhibitNFT.sol/ExhibitNFT.json';
import USDTABI from '../artifacts/contracts/USDT_OP/usdtoptimism.json';

export const CONTRACT_ADDRESSES = {
  EventOrganizerServiceAdd: '',
  USDTAdd: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  MuseumAdd: '',
  exhibitId: '',
  EscrowAdd: '',
};

// Export ABIs directly
export const ABIs = {
  EventOrganizerServiceABI,
  MuseumABI,
  ArtifactNFTABI,
  EventEscrowABI,
  USDTABI,
  ExhibitNFTABI,
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

  getEventEscrow: (address: string) => {
    const { signer } = initializeUserWallet();
    return new ethers.Contract(
      address,
      EventEscrowABI as ethers.ContractInterface,
      signer
    );
  },

  getMUSDC: () => {
    const { signer } = initializeUserWallet();
    return new ethers.Contract(
      CONTRACT_ADDRESSES.USDTAdd,
      USDTABI as ethers.ContractInterface,
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
};
