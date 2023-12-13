import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server'
import { ethers } from "ethers";
import EventOrganizerServiceABI from '../../../utils/artifacts/contracts/EventOrganizerService.sol/EventOrganizerService.json';

const EOSABI = EventOrganizerServiceABI as unknown as ethers.ContractInterface;
// Exhibit Object
type ExhibitParams = {
    name : string;
    symbol : string;
    ticketPrice : string;
    beneficiaries : string[];
    shares: number[];
    baseURI: string;
    location: string;
    artifactNFT: string;
    details: string;
    id: string;
};

async function callDeployEventApi(eventId: string) {
    const url = 'http://localhost:3000/api/events/deploy';
    const requestBody = {
        event_id: eventId
    };

    try {
        // existing try block code
    } catch (error ) {
        console.error('Error calling the deploy event API:', error);
        throw new Error(`Failed to call deploy event API: ${error}`);
    }


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data : ExhibitParams  = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling the deploy event API:', error);
        throw error;
    }
}
// Deploy Function v1
async function deployExhibit(exhibitParams: ExhibitParams) {
    try{
        // Connect to Node Provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

        // Transaction Signer Wallet
        const devPrivateKey = process.env.DEV_PRIVATE_KEY;

        if (typeof devPrivateKey !== 'string') {
            throw new Error('DEV_PRIVATE_KEY is not defined or is not a valid string.');
        }

        const wallet = new ethers.Wallet(devPrivateKey, provider);

        // Address of deployed EventOrganizerService
        const organizerServiceAddress = "0xdFB611127315848Fd0D53226eC886BbF6514B5D1";

        // Create instance
        const organizerServiceContract = new ethers.Contract(
            organizerServiceAddress,
            EOSABI, // Imported From Utils folder(Updated typchain and artifacts)
            wallet // Signer
        );

        // ParseUnits Method?
        const ticketPriceWei = ethers.utils.parseUnits(exhibitParams.ticketPrice, 18)

        // organizeExhibit Method Call
        const tx = await organizerServiceContract.organizeExhibit(
            exhibitParams.name,
            exhibitParams.symbol,
            ticketPriceWei,
            //exhibitParams.ticketPrice,
            exhibitParams.beneficiaries,
            exhibitParams.shares,
            exhibitParams.baseURI,
            exhibitParams.location,
            exhibitParams.artifactNFT,
            exhibitParams.details,
            exhibitParams.id
        );

        // Block Wait Time for Transaction to be Mined
        const receipt = await tx.wait(6);

        //Return Transaction Receipt
        return receipt;

    } catch (error) {
        console.error('Error deploying Exhibit', error);
        throw error; //For API Handler to Catch 
    }

    }

   
    export async function POST(req :Request) {

        const reqBody =await req.json()
        const {  event_id }: { event_id: string   } = reqBody;
        try {
           const exhibitParams = await  callDeployEventApi(event_id)
           console.log(exhibitParams)
            
            const receipt = await  deployExhibit(exhibitParams)
            console.log(receipt)
            NextResponse.json({ Success:"Great success",receipt},{status:201})  

            
        } catch (error) {
           NextResponse.json({faliure:"you are a faliure"},{status:500})  
        }

    }