/*
Category: Blockchain Interaction Layer
Purpose: Provides utility functions for initializing and interacting with smart contracts on the blockchain using ethers.js. Includes contract address management and ABI imports for seamless integration within the application.
*/

import { ethers } from "ethers";
import { initializeDevWallet, initializeUserWallet } from "./walletInit";

import EventOrganizerServiceABI from '../artifacts/contracts/EventOrganizerService.sol/EventOrganizerService.json'
import MuseumABI from '../artifacts/contracts/Museum.sol/Museum.json'
import ArtifactNFTABI from '../artifacts/contracts/ArtifactNFT.sol/ArtifactNFT.json'
import EventEscrowABI from '../artifacts/contracts/EventEscrow.sol/EventEscrow.json'
import MUSDCABI from '../artifacts/contracts/MUSDC.sol/MUSDC.json'
import ExhibitNFTABI from '../artifacts/contracts/ExhibitNFT.sol/ExhibitNFT.json'
import DonationsABI from "../artifacts/contracts/Donations.sol/Donations.json"


export const CONTRACT_ADDRESSES = {
    EventOrganizerServiceAdd : '0x07591Dec37a5E1299fBC302B285712aA550b0Dd4',
    MUSDCAdd : '0x9C337031e628cE48f24113db2b3437b83fB668a5',
    MuseumAdd : '0x47CA7e46cEDCD8cB2ddAd9646c4F7954e9bE49D1',
    exhibitId : '0x42c37c91d2e9157d7730be5913afb3a49c5f0bd3',
    EscrowAdd : '0x47e57da995734d4b573a48fb39de3a4c1d55670c'
};

// Export ABIs directly
export const ABIs = {
    EventOrganizerServiceABI,
    MuseumABI,
    ArtifactNFTABI,
    EventEscrowABI,
    MUSDCABI,
    ExhibitNFTABI,
    DonationsABI
};

export const contracts = {
    getEventOrganizerService: () => {
        const {wallet} = initializeDevWallet();
        return new ethers.Contract(
            CONTRACT_ADDRESSES.EventOrganizerServiceAdd,
            EventOrganizerServiceABI as ethers.ContractInterface, // `unknown` operator is used to dodge a type issue which can also be solved by removing the outer tags of the contract ABI 
            wallet
        );
    },
    
    getArtifactNFT: (address : string) => { // Accepting dynamic address for flexibility
        const {wallet} = initializeDevWallet();
        return new ethers.Contract(
            address, // Using a dynamic address for ArtifactNFT instances
            ArtifactNFTABI as ethers.ContractInterface,
            wallet
        );
    },

    getEventEscrow: (address : string) => {
        const {signer} = initializeUserWallet();
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
        )
    },

    getMuseum: () => {
        const { signer } = initializeUserWallet();
        return new ethers.Contract(
            CONTRACT_ADDRESSES.MuseumAdd,
            MuseumABI,
            signer
        )
    },

    getExhibitNFT: (address : string) => { // Accepting dynamic address for flexibility
        const {wallet} = initializeDevWallet();
        return new ethers.Contract(
            address, // Using a dynamic address for ArtifactNFT instances
            ExhibitNFTABI as
             ethers.ContractInterface,
            wallet
        );
    },

    getDonations: (address : string) => {
        const {wallet} = initializeDevWallet();
        return new ethers.Contract(
            address,
            DonationsABI as unknown as ethers.ContractInterface,
            wallet
        );
    }
};
