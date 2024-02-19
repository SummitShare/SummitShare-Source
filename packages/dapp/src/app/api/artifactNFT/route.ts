import { ethers } from "ethers"
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Event Organizer Contract ABI and Address
import EventOrganizerServiceABI from '../../../utils/artifacts/contracts/EventOrganizerService.sol/EventOrganizerService.json';
const EventOrganizerAddress = '0xdFB611127315848Fd0D53226eC886BbF6514B5D1';

// ArtifactNFT Contract ABI and Address
import  ArtifactNFTABI  from '../../../utils/artifacts/contracts/ArtifactNFT.sol/ArtifactNFT.json';
const ANABI = ArtifactNFTABI as unknown as ethers.ContractInterface;


// Type declarations for deployment function parameters
type ArtifactNFTDeployment = {
    name: string,
    symbol: string,
    ownerAddress: string,
    baseURIParam: string;
}


// Deploy artifactNFT via the Event organizer function
async function deployArtifactNFT (artifactnftdeployment: ArtifactNFTDeployment) : Promise<void> {

    try {

        //Initizalize RPC Provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

        //Check if privatekey has been initalized and is read
        const devPrivateKey = process.env.DEV_PRIVATE_KEY;
         if (!devPrivateKey) {
         throw new Error('DEV_PRIVATE_KEY is not defined.');}

        const wallet = new ethers.Wallet(devPrivateKey, provider);

        // Instance of organizer service contract
        const organizerServiceContract = new ethers.Contract(EventOrganizerAddress, EventOrganizerServiceABI, wallet);

        // EventOrganizer function call
        const tx0 = await organizerServiceContract.deployArtifactNFT(
            artifactnftdeployment.name,
            artifactnftdeployment.symbol,
            artifactnftdeployment.ownerAddress,
            artifactnftdeployment.baseURIParam
    );

    // Store and return receipt
    const receipt0 = await tx0.wait(6);
    console.log(receipt0)

    const ArtifactNFTAddress = receipt0.contractAddress; // Get the deployed contract's address
    console.log(`Artifact NFT contract Deployed to: ${ArtifactNFTAddress}`)
    return ArtifactNFTAddress;

    } catch (error) {
        console.error('ArtifactNFT deployment Failed:', error);
        console.error("Deployment failed:", error);
        throw error; 
    }
}

// Type declarations for deployment function parameters
type ArtifactNFTMinting = {
    recipientAddress: string,
    mintQuantity: number;
}


export async function mint(ArtifactNFTAddress: string, artifactnftminting : ArtifactNFTMinting) : Promise<void> {

    try {
        // Initialization of RPC
        const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

        // Check if private key has been initialized
        const devPrivateKey = process.env.DEV_PRIVATE_KEY;

         if (!devPrivateKey) {
         throw new Error('DEV_PRIVATE_KEY is not defined.');
        }

        const wallet = new ethers.Wallet(devPrivateKey, provider);

        // Contract instance defintion
        const artifactNFT = new ethers.Contract(ArtifactNFTAddress, ANABI, wallet);

        // Minting Parameters
        const recipientAddress = "0x2c455e30e4E47A4458A4df9f36494F75FbDc0e7f";
        const mintQuantity = 6;


        //Mint function call
        const tx1 = await artifactNFT.mint(
           artifactnftminting.recipientAddress,
           artifactnftminting.mintQuantity,

           // Hardcoded gas limit for development 
           {
                gasLimit: ethers.utils.hexlify(161833) 
           }
        );

        // Store and return reciept of transaction
        const receipt1 = await tx1.wait(6);
        console.log(`Minted ${mintQuantity} NFTs to ${recipientAddress}. Transaction hash: ${receipt1.transactionHash}`);

        // Iterate through and log URIs to be minted
        for (let tokenId = 1; tokenId <= mintQuantity; tokenId++) {
            const tokenURI = await artifactNFT.tokenURI(tokenId);
            console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
        
            try {
                const response = await axios.get(tokenURI);
                console.log(`Metadata for Token ID ${tokenId}: `, response.data);
            } catch (error) {
                console.error(`Failed to fetch metadata for Token ID ${tokenId}:`, error);
            }
        }

        return receipt1;
        
    } catch (error) {
        console.error('ArtifactNFT deployment Failed:', error);
        console.error("Deployment failed:", error);
        throw error;
        
    }
}

// export async function GET (req: Request){
//     const deploymentParams : ArtifactNFTDeployment = {
//         name: "LeadingLadies",
//         symbol: "LLEZ",
//         ownerAddress: "0x6E95E4a97efb1FaDE341Cd867F07101C7b997151",
//         baseURIParam: "https://s3.tebi.io/summitsharemetadata/leadingLadies/"
//     }

//    const receipt=  await deployArtifactNFT(deploymentParams);

//    try {

//     return NextResponse.json({ Success: "Great success, you are failure no longer, now wife and kids have home", receipt }, { status: 201 });

// } catch (error) {
//     // Return error response
//     if(error instanceof Error)
//     return NextResponse.json({ failure: "you are a faliure", error: error.message }, { status: 500 });
// }
// }

