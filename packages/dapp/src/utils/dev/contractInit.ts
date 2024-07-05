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
  EventOrganizerServiceAdd: '0xdFB611127315848Fd0D53226eC886BbF6514B5D1',
  MUSDCAdd: '0xDd4c60185608108D073C19432eef0ae50AB3830d',
  MuseumAdd: '0xF4857Efc226Bb39C6851Aa137347CFf8F8e050F9',
  exhibitId: '0x9da59e03c4512d6b47f84522452b53d1250459d8',
  EscrowAdd: '0x741b12d361683edccaafe3d8ccc898eb6b52377b',
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
