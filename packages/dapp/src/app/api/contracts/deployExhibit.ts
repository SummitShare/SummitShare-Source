import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

// Exhibit Object
type ExhibitParams = {
    name : string;
    symbol : string;
    ticketPrice : string;
    beneficaries : string[];
    shares: number[];
    baseURI: string;
    location: string;
    artifactNFT: string;
    details: string;
    id: string;
};

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
        const organizerServiceAddress = '0xdFB611127315848Fd0D53226eC886BbF6514B5D1';

        // Create instance
        const organizerServiceContract = new ethers.Contract(
            organizerServiceAddress,
            ['function organizeExhibit(...) returns (address)'], //ABI Interface
            wallet
        );

        // ParseUnits Method?
        const ticketPriceWei = ethers.utils.parseUnits(exhibitParams.ticketPrice, 18)

        // organizeExhibit Method Call
        const tx = await organizerServiceContract.organizeExhibit(
            exhibitParams.name,
            exhibitParams.symbol,
            ticketPriceWei,
            //exhibitParams.ticketPrice,
            exhibitParams.beneficaries,
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

    //API Handler Function
    export default async function handler(
        req: NextApiRequest,
        res: NextApiResponse

    ) {
        if (req.method == 'POST') {
            try {
                // Validate & Extract Exhibit Params From Request
                const exhibitParams: ExhibitParams = req.body;
                const receipt = await deployExhibit(exhibitParams);

                // Status Logging
                res.status(200).json ({ receipt });

            } catch (error) {
                console.error('Error Deploying Exhibit:', error);
                res.status(500).json ({error: 'Great Failure'});
            }

        } else {
            //Handle Non-Post Requests
            res.setHeader('Allow', 'POST');
            res.status(405).end('Illegal Method');
        }

        }    
