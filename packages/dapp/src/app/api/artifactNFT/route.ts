/*
Category: Blockchain Interaction Layer - API
Purpose: Deploys tokenized artifacts via the EventOraganizerService Contract
*/

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ArtifactNFTDeployment, ArtifactNFTMinting } from "@/utils/dev/typeInit";
import { contracts } from "@/utils/dev/contractInit";

// Function to deploy an ArtifactNFT contract
const deployArtifactNFT = async (artifactnftdeployment : ArtifactNFTDeployment) => {
    try {
        // Retrieve the EventOrganizerService contract instance
        const organizerServiceContract = contracts.getEventOrganizerService();

        // Deploy the ArtifactNFT contract with the provided details
        const tx0 = await organizerServiceContract.deployArtifactNFT(
            artifactnftdeployment.name,
            artifactnftdeployment.symbol,
            artifactnftdeployment.owner,
            artifactnftdeployment.baseURIParam   
        );

        // Wait for the transaction to be mined
        const receipt0 = await tx0.wait(6);

        // Find the "ArtifactNFTDeployed" event to extract the deployed contract address
        const event = receipt0.events?.find((e: { event: string; }) => e.event ==="ArtifactNFTDeployed");
        const ArtifactNFTAddress = event?.args?.artifactNFTAddress;

        //console.log(`ArtifactNFT Contract Deployed to: ${ArtifactNFTAddress}`);
        return ArtifactNFTAddress;

    } catch (error) {
        console.error('Error deploying ArtifactNFT:', error);
        throw error;    
    };
};

// Function to mint NFTs on the deployed ArtifactNFT contract
const mintArtifactNFTs = async (ArtifactNFTAddress : string, artifactnftminting : ArtifactNFTMinting) => {
    try {
        // Retrieve the deployed ArtifactNFT contract instance by address
        const artifactNFTContract = contracts.getArtifactNFT(ArtifactNFTAddress);

         // Mint NFTs to the specified recipient address with the given quantity
        const tx1 = await artifactNFTContract.mint(
            artifactnftminting.recipientAddress,
            artifactnftminting.mintQuantity,
        );

        // Wait for the minting transaction to be mined
        const receipt1 = await tx1.wait(6);
        console.log(`Minted ${artifactnftminting.mintQuantity} NFTs to: ${artifactnftminting.recipientAddress}. Transaction hash: ${receipt1.transactionHash}`);

            // Iterate through each minted NFT to fetch and log its token URI
            for (let tokenId = 1; tokenId <= artifactnftminting.mintQuantity; tokenId++) {
            const tokenURI = await artifactNFTContract.tokenURI(tokenId);
            console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
            
            try {
                // Fetch the metadata for each token URI and log it
                const response = await axios.get(tokenURI);
                console.log(`Metadata for Token ID ${tokenId}: `, response.data);
            } catch (error) {
                console.error(`Failed to fetch metadata for Token ID ${tokenId}:`, error);
            }
        }
         return receipt1

    } catch (error) {
        console.error(`Error minting NFTs:`, error);
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

