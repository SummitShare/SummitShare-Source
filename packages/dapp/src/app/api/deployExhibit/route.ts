import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import EventOrganizerServiceABI from '../../../utils/artifacts/contracts/EventOrganizerService.sol/EventOrganizerService.json';
import prisma from "../../../../config/db";

const EOSABI = EventOrganizerServiceABI as unknown as ethers.ContractInterface;



// Exhibit Object Type
type ExhibitParams = {
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
};


interface BigNumber {
    _hex: string;
    _isBigNumber: boolean;
  }
  
  interface LogEntry {
    transactionIndex: number;
    blockNumber: number;
    transactionHash: string;
    address: string;
    topics: string[]; // Assuming topics are an array of strings
    data: string;
    logIndex: number;
    blockHash: string;
  }
  
  interface EventEntry extends LogEntry {
    removeListener?: Function; // Replace with more specific function type if known
    getBlock?: Function; // Replace with more specific function type if known
    getTransaction?: Function; // Replace with more specific function type if known
    getTransactionReceipt?: Function; // Replace with more specific function type if known
    args?: any[]; // Replace with more specific type if known
    decode?: Function; // Replace with more specific function type if known
    event?: string;
    eventSignature?: string;
  }
  
  interface TransactionReceipt {
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
  
  

// Function to call an external API for event parameters
async function callDeployEventApi(eventId: string): Promise<ExhibitParams> {
    const url = 'http://localhost:3000/api/events/deploy';
    const requestBody = { event_id: eventId };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ExhibitParams = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling the deploy event API:', error);
        throw new Error(`Failed to call deploy event API: ${error}`);
    }
}

// Function to deploy an exhibit
async function deployExhibit(exhibitParams: ExhibitParams) {
    try {
        // Validating input parameters
        validateExhibitParams(exhibitParams);

        // Connect to Node Provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

        // Transaction Signer Wallet
        const devPrivateKey = process.env.DEV_PRIVATE_KEY;
        // Private Key Check
        if (!devPrivateKey) {
            throw new Error('DEV_PRIVATE_KEY is not defined.');
        }

        const wallet = new ethers.Wallet(devPrivateKey, provider);

        // Address of deployed EventOrganizerService
        const organizerServiceAddress = "0xdFB611127315848Fd0D53226eC886BbF6514B5D1";
        validateEthereumAddress(organizerServiceAddress, "Organizer Service Address");

        // Create contract instance
        const organizerServiceContract = new ethers.Contract(
            organizerServiceAddress,
            EOSABI,
            wallet
        );

        // Parse ticket price to Wei
       // const ticketPriceWei = ethers.utils.parseUnits(exhibitParams.ticketPrice, 18)

        // Organize exhibit
        const tx = await organizerServiceContract.organizeExhibit(
            exhibitParams.name,
            exhibitParams.symbol,
            //ticketPriceWei,
            exhibitParams.ticketPrice,
            exhibitParams.beneficiaries,
            exhibitParams.shares,
            exhibitParams.baseURI,
            exhibitParams.location,
            exhibitParams.artifactNFT,
            exhibitParams.details,
            exhibitParams.id,
            {
                gasLimit: ethers.utils.hexlify(2800000) 
            }
        );

        // Wait for transaction to be mined
        const receipt = await tx.wait(6);
        return receipt;
    } catch (error) {
        console.error('Error deploying Exhibit:', error);
        throw new Error(`Exhibit deployment failed: ${error}`);
    }
}

// Function to validate exhibit parameters
function validateExhibitParams(exhibitParams: ExhibitParams) {
    // Validate string parameters
    const stringParams = ['name', 'symbol', 'baseURI', 'location', 'details', 'id'];
    stringParams.forEach(param => {
        if (!exhibitParams.name || exhibitParams.name.length === 0) {
            throw new Error("Exhibit name is required.");
        }
    });

         // Validate ticket price
    if (isNaN(parseFloat(exhibitParams.ticketPrice)) || parseFloat(exhibitParams.ticketPrice) <= 0) {
        throw new Error("Invalid ticket price.");
    }

     // Validate beneficiaries and shares arrays
     if (!Array.isArray(exhibitParams.beneficiaries) || !Array.isArray(exhibitParams.shares)) {
        throw new Error("Beneficiaries and shares must be arrays.");
    }

    if (exhibitParams.beneficiaries.length !== exhibitParams.shares.length) {
        throw new Error("Beneficiaries and shares arrays must be of the same length.");
    }

    let totalShares = 0;
    exhibitParams.beneficiaries.forEach((address, index) => {
        validateEthereumAddress(address, `Beneficiary address at index ${index}`);
        const share = exhibitParams.shares[index];
        if (typeof share !== 'number' || share <= 0) {
            throw new Error(`Invalid share at index ${index}.`);
        }
        totalShares += share;
    });

    if (totalShares !== 100) {
        throw new Error("Total shares must sum up to 100.");
    }

    // Validate artifactNFT address
    validateEthereumAddress(exhibitParams.artifactNFT, "Artifact NFT Address");
}

// Function to validate Ethereum addresses
function validateEthereumAddress(address: string, addressName: string) {
    if (!ethers.utils.isAddress(address)) {
        throw new Error(`${addressName} is not a valid Ethereum address.`);
    }
}

// Function to validate private key
function validatePrivateKey(key: string | undefined) {
    if (typeof key !== 'string' || key.length === 0) {
        throw new Error('DEV_PRIVATE_KEY is not defined or is not a valid string.');
    }
}

// POST Handler for API Route
export async function POST(req: Request) {
    try {
        // Validate and parse the request body
        const { event_id } : { event_id: string } = await req.json();
        console.log(event_id)

        // Call API or function to get exhibit parameters based on the event_id
        const exhibitParams = await callDeployEventApi(event_id);


        // Deploy the exhibit using the retrieved parameters
        const receipt: TransactionReceipt = await deployExhibit(exhibitParams);
        console.log(receipt.logs[2].address);
        console.log(receipt.logs[3].address);
        console.log(receipt.events[2].address);
        console.log(receipt.events[3].address);

        const contract_address = receipt.logs[2].address

        //Update database with exhibitid address
        // await prisma.events.update({
        //     where: {id: event_id},
        //     data: {contract_address:receipt.address}

        // })

        const contract = await prisma.contracts.create({
          data:{
            contract_address,
            contract_type:"EOA",
            event_id:event_id
            },

        })
        
        

        // Return success response
        return NextResponse.json({ Success: "Great success, you are failure no longer, now wife and kids have home", receipt }, { status: 201 });

    } catch (error) {
        // Return error response
        if(error instanceof Error)
        return NextResponse.json({ failure: "you are a failure", error: error.message }, { status: 500 });
    }
}

// Function to parse and validate the request body
async function parseAndValidateRequestBody(req: NextApiRequest): Promise<{ event_id: string }> {
    if (!req.body) {
        throw new Error("Request body is missing.");
    }

    let event_id: string;

    try {
        // Attempt to parse the JSON body
        const reqBody = JSON.parse(req.body);
        event_id = reqBody.event_id;
    } catch (error) {
        // Handle any parsing errors
        throw new Error("Invalid JSON in the request body.");
    }

    if (!event_id || typeof event_id !== 'string') {
        throw new Error("Invalid event_id in request body.");
    }

    return { event_id };
}


