/*
Category: Blockchain Interaction Layer
Purpose: Provides type interfaces for the various layers of smart contract interaction within dapp
*/
import { ethers } from 'ethers';

// <----- Contract Function Parameters Type Interfaces ------>

// ArtifactNFT Contract
export interface ArtifactNFTDeployment {
   name: string;
   symbol: string;
   owner: string;
   baseURIParam: string;
}

export interface ArtifactNFTMinting {
   recipientAddress: string;
   mintQuantity: number;
}

// Event Organizer Service Contract
export interface ExhibitParams {
   name: string;
   symbol: string;
   ticketPrice: string;
   beneficiaries: string[];
   shares: number[];
   baseURI: string;
   location: string;
   artifactNFT: string;
   details: string;
   id: string;
}

// Event Escrow Contract
export interface EventEscrowComponentProps {
   provider: ethers.providers.Web3Provider;
   exhibitId: string;
   userAddress: string | undefined;
}

// Museum Contract
export interface TicketPurchaseProps {
   userAddress: string;
   exhibitId?: string;
   user_id: string;
}

// <----- Utilities ------>

//deloyExhibit.ts & Event Organizer Service.sol
export interface BigNumber {
   _hex: string;
   _isBigNumber: boolean;
}

export interface LogEntry {
   transactionIndex: number;
   blockNumber: number;
   transactionHash: string;
   address: string;
   topics: string[]; // Assuming topics are an array of strings
   data: string;
   logIndex: number;
   blockHash: string;
}

export interface EventEntry extends LogEntry {
   removeListener?: Function; // Replace with more specific function type if known
   getBlock?: Function; // Replace with more specific function type if known
   getTransaction?: Function; // Replace with more specific function type if known
   getTransactionReceipt?: Function; // Replace with more specific function type if known
   args?: any[]; // Replace with more specific type if known
   decode?: Function; // Replace with more specific function type if known
   event?: string;
   eventSignature?: string;
}

export interface TransactionReceipt {
   to: string;
   from: string;
   contractAddress: string | null;
   transactionIndex: number;
   gasUsed: BigNumber;
   logsBloom: string;
   blockHash: string;
   transactionHash: string;
   logs: LogEntry[];
   blockNumber: number;
   confirmations: number;
   cumulativeGasUsed: BigNumber;
   effectiveGasPrice: BigNumber;
   status: number;
   type: number;
   byzantium: boolean;
   events: EventEntry[];
}

// ticketpurchasecomponent.tsx
export interface EthereumWindow extends Window {
   ethereum?: ethers.providers.ExternalProvider;
   web3?: any;
}

// <----- APIs ------>

// createEvent/route
export interface IPropsal {
   stakes: IStakes;
   event_type: string; // assuming event_type_enum is a string enum
   event_name?: string;
   event_category?: string; // assuming event_category_enum is a string enum
   event_start_time?: Date;
   symbol?: string;
   event_timezone?: string;
   event_location?: string;
   description?: string;
   contract_address?: string;
   event_end_time?: Date;
   cost?: number; // Decimal type in Prisma translates to number in TypeScript
   total_number_tickets?: number;
   // Additional properties for relations can be added if needed
}

export interface EmailArray extends Array<string> {}

export interface EmailStatus {
   exists: boolean;
   sent: boolean;
   status: number;
}

// proposals/createNewProposal

export interface IStakes {
   [stakeholder: string]: number;
}

export interface EventData {
   event_type: string;
   event_name: string;
   event_category: string;
   event_start_time: string;
   event_timezone: string;
   event_location: string;
   description: string;
   event_end_time: string;
   cost: number;
   total_number_tickets: number;
   symbol: string;
   stakes: {
      [email: string]: number;
   };
}

export interface StakeholderStakes {
   [stakeholderId: string]: number;
}
