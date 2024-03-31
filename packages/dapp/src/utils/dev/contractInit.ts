/*
Category: Blockchain Interaction Layer
Purpose: Provides utility functions for initializing and interacting with smart contracts on the blockchain using ethers.js. Includes contract address management and ABI imports for seamless integration within the application.
*/

import { ethers } from "ethers";
import { initializeWallet } from "./walletInit";

import EventOrganizerServiceABI from '../artifacts/contracts/EventOrganizerService.sol/EventOrganizerService.json'
import MuseumABI from '../artifacts/contracts/Museum.sol/Museum.json'
import ArtifactNFTABI from '../artifacts/contracts/ArtifactNFT.sol/ArtifactNFT.json'
import EventEscrowABI from '../artifacts/contracts/EventEscrow.sol/EventEscrow.json'
import MUSDCABI from '../artifacts/contracts/MUSDC.sol/MUSDC.json'


export const CONTRACT_ADDRESSES = {
    EventOrganizerServiceAdd : '0xdFB611127315848Fd0D53226eC886BbF6514B5D1',
    MUSDCAdd : '0xDd4c60185608108D073C19432eef0ae50AB3830d',
    MuseumAdd : '0xF4857Efc226Bb39C6851Aa137347CFf8F8e050F9'
};

// Export ABIs directly
export const ABIs = {
    EventOrganizerServiceABI,
    MuseumABI,
    ArtifactNFTABI,
    EventEscrowABI,
    MUSDCABI,
};

export const contracts = {
    getEventOrganizerService: () => {
        const wallet = initializeWallet();
        return new ethers.Contract(
            CONTRACT_ADDRESSES.EventOrganizerServiceAdd,
            EventOrganizerServiceABI as unknown as ethers.ContractInterface,
            wallet
        );
    },
    getArtifactNFT: (address : string) => { // Accepting dynamic address for flexibility
        const wallet = initializeWallet();
        return new ethers.Contract(
            address, // Using a dynamic address for ArtifactNFT instances
            ArtifactNFTABI as unknown as ethers.ContractInterface,
            wallet
        );
    },
    getEventEscrow: (address : string) => {
        const wallet = initializeWallet();
        return new ethers.Contract(
            address, 
            EventEscrowABI as unknown as ethers.ContractInterface,
            wallet
        );
    },
    getMUSDC: (signer?: ethers.Signer) => {
        const contract = new ethers.Contract(
            CONTRACT_ADDRESSES.MUSDCAdd,
            MUSDCABI as ethers.ContractInterface,
            signer || initializeWallet() // Use provided signer or initialize a new wallet
        );
        return contract;
    },

    getMuseum: (signer?: ethers.Signer) => {
        const contract = new ethers.Contract(
            CONTRACT_ADDRESSES.MuseumAdd,
            MuseumABI as ethers.ContractInterface,
            signer || initializeWallet() // Use provided signer or initialize a new wallet
        );
        return contract;

    }
};
