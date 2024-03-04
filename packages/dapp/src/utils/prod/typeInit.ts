import { ethers } from "ethers";

// <----- Contract Function Parameters Type Interfaces ------>

// ArtifactNFT Contract
export interface ArtifactNFTDeployment {
    name : string;
    symbol : string;
    owner : string
    baseURIParam : string;
};

export interface ArtifactNFTMinting {
    recieptientAddress : string;
    mintQuantiy : number;
};

// Event Organizer Service Contract
export interface ExhibitParams {
    name : string;
    symbol : string;
    ticketPrice : string;
    beneficiaries: string[];
    shares: number[];
    baseURI: string;
    location: string;
    artifactNFT: string;
    details: string;
    id: string;
};


// Event Escrow Contract
export interface EventEscrowComponentProps {
    provider: ethers.providers.Web3Provider;
    exhibitId: string;
}

// Museum Contract
export interface TicketPurchaseProps {
    userAddress: string;
    exhibitId: string;
  };



// <----- Utilities ------>


//deloyExhibit.ts & Event Organizer Service.sol
export interface BigNumber {
    _hex: string;
    _isBigNumber: boolean;
  };

export interface LogEntry {
    transactionIndex: number;
    blockNumber: number;
    transactionHash: string;
    address: string;
    topics: string[]; // Assuming topics are an array of strings
    data: string;
    logIndex: number;
    blockHash: string;
  };
  
export interface EventEntry extends LogEntry {
    removeListener?: Function; // Replace with more specific function type if known
    getBlock?: Function; // Replace with more specific function type if known
    getTransaction?: Function; // Replace with more specific function type if known
    getTransactionReceipt?: Function; // Replace with more specific function type if known
    args?: any[]; // Replace with more specific type if known
    decode?: Function; // Replace with more specific function type if known
    event?: string;
    eventSignature?: string;
  };

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
  };

// ticketpurchasecomponent.tsx 

export interface EthereumWindow extends Window {
  ethereum?: ethers.providers.ExternalProvider;
  web3?: any;
};