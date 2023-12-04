import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import MuseumABIJson from '../../../utils/artifacts/contracts/Museum.sol/Museum.json';
const MuseumABI = MuseumABIJson as unknown as ethers.ContractInterface; //Ts fix for format mismatch


async function purchaseTicket(req: NextApiRequest, res: NextApiResponse) {
    try {
        
        // Validate request method
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        // Extract parameters from the request body
        const { userAddress, exhibitId, ticketPrice } = req.body;
        if (!userAddress || !exhibitId || !ticketPrice) {
            res.status(400).send('Missing required parameters');
            return;
        }

        // Connect to Ethereum provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

        // Wallet signing the transaction (Server-side wallet)
                // Transaction Signer Wallet
                const devPrivateKey = process.env.DEV_PRIVATE_KEY;

                if (typeof devPrivateKey !== 'string') {
                    throw new Error('DEV_PRIVATE_KEY is not defined or is not a valid string.');
                }
                
                const wallet = new ethers.Wallet(devPrivateKey, provider);

        // Address of the deployed Museum contract
        const museumAddress = "0xF4857Efc226Bb39C6851Aa137347CFf8F8e050F9";

        // Create an instance of the Museum contract
        const museumContract = new ethers.Contract(museumAddress, MuseumABI, wallet);

        // Call the purchaseTicket function of the Museum contract
        const tx = await museumContract.purchaseTicket(userAddress, exhibitId, {
            value: ethers.utils.parseEther(ticketPrice)
        });

        // Wait for the transaction to be mined
        const receipt = await tx.wait(6);

        // Return the transaction receipt
        res.status(200).json({ receipt });
    } catch (error) {
        console.error('Ticket Purchase Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default purchaseTicket;
