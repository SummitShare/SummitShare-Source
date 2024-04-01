import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ArtifactNFTDeployment, ArtifactNFTMinting } from "@/utils/dev/typeInit";
import { contracts } from "@/utils/dev/contractInit";
import prisma from "../../../../config/db";
import { testWallets } from "@/utils/dev/walletInit";


/**
 * Function to deploy an ArtifactNFT contract.
 * It utilizes the EventOrganizerService contract to deploy a new ArtifactNFT contract
 * with specified parameters and returns the address of the newly deployed contract.
 */

const deployArtifactNFT = async (artifactnftdeployment: ArtifactNFTDeployment) => {
    try {
        // Retrieve the EventOrganizerService contract instance
        const organizerServiceContract = contracts.getEventOrganizerService();
        
        // Deploy the ArtifactNFT contract with the provided details
        const tx0 = await organizerServiceContract.deployArtifactNFT(
            artifactnftdeployment.name,
            artifactnftdeployment.symbol,
            artifactnftdeployment.owner,
            artifactnftdeployment.baseURIParam , 
        );

        // Wait for the transaction to be mined
        const receipt0 = await tx0.wait(4);
        const deploymentTransactionHash = tx0.hash; // Capture the deployment transaction hash

        // Find the "ArtifactNFTDeployed" event to extract the deployed contract address
        const event = receipt0.events?.find((e: { event: string; }) => e.event ==="ArtifactNFTDeployed");
        const ArtifactNFTAddress = event?.args?.artifactNFTAddress;

        console.log(`ArtifactNFT Contract Deployed to: ${ArtifactNFTAddress}`);
        console.log(`Deployment Transaction Hash: ${deploymentTransactionHash}`);

        return {ArtifactNFTAddress, deploymentTransactionHash};
    } catch (error) {
        console.error('Error deploying ArtifactNFT:', error);
        throw error;    
    }
};

/*
 * Function to mint NFTs on a deployed ArtifactNFT contract.
 * It mints a specified quantity of NFTs to a recipient address and logs each NFT's token URI.
 */

const mintArtifactNFTs = async (ArtifactNFTAddress: string, artifactnftminting: ArtifactNFTMinting) => {
    let artifactNFTContract;
    try {
        // Retrieve the deployed ArtifactNFT contract instance by address
        artifactNFTContract = contracts.getArtifactNFT(ArtifactNFTAddress);
    } catch (error) {
        console.error(`Error retrieving ArtifactNFT contract instance at address ${ArtifactNFTAddress}:`, error);
        throw error;
    }

    try {
        // Mint NFTs to the specified recipient address with the given quantity
        const tx1 = await artifactNFTContract.mint(
            artifactnftminting.recipientAddress,
            artifactnftminting.mintQuantity,
        );

        // Wait for the minting transaction to be mined
        const receipt1 = await tx1.wait(8);
        const mintingTransactionHash = tx1.hash;

            // Iterate through each minted NFT to fetch and log its token URI
    for (let tokenId = 1; tokenId <= artifactnftminting.mintQuantity; tokenId++) {
        try {
            const tokenURI = await artifactNFTContract.tokenURI(tokenId);
            console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
        } catch (error) {
            console.error(`Failed to fetch metadata for Token ID ${tokenId}:`, error);
        }
    }
        console.log(`Minted ${artifactnftminting.mintQuantity} NFTs to: ${artifactnftminting.recipientAddress}. Transaction hash: ${receipt1.transactionHash}`);
        return {mintingTransactionHash, receipt: receipt1};
    } catch (error) {
        console.error(`Error minting NFTs to ${artifactnftminting.recipientAddress} with quantity ${artifactnftminting.mintQuantity}:`, error);
        throw error;
    }
};

/**
 * Handler function for POST requests.
 * This function orchestrates the deployment of an ArtifactNFT contract and the minting of NFTs
 * based on the event and collection details provided in the request.
 */

export async function POST(req: Request) {
    try {
        // Parse the request body to extract the event ID
        const requestBody = await req.json();
        const { event_id } = requestBody;

        // Retrieve the event and collection details from the database
        const event = await prisma.events.findUnique({ where: { id: event_id } });
        const collection = await prisma.collections.findFirst({ where: { event_id: event_id } });

        if (!event || !collection) {
            return NextResponse.json({ failure: "Event or Collection not found" }, { status: 404 });
        }

        // Prepare deployment parameters for the ArtifactNFT
        const deploymentParams : ArtifactNFTDeployment = {
            name: collection.name!,
            symbol: event.symbol!,
            owner: testWallets[1]!, //  testWallets[1] contains the owner address 
            baseURIParam: collection.baseURI!,
        };

        // Deploy the ArtifactNFT using the prepared parameters
        const { ArtifactNFTAddress, deploymentTransactionHash } = await deployArtifactNFT(deploymentParams);

        // Prepare minting parameters - Hardcoded for Dev
        const mintParams: ArtifactNFTMinting = {
            recipientAddress: process.env.araragi!, // or testWallets[0]
            mintQuantity: 6,
        };

        // Perform the minting operation
        const { mintingTransactionHash, receipt: mintReceipt } = await mintArtifactNFTs(ArtifactNFTAddress, mintParams);
        // Include both deployment and minting details in the response
        return NextResponse.json({
            message: "NFTs minted successfully.",
            deployment: {
                address: ArtifactNFTAddress,
                transactionHash: deploymentTransactionHash
            },
            minting: {
                transactionHash: mintingTransactionHash,
                receipt: mintReceipt
            }
        }, { status: 201 });
    } catch (error) {
        console.error(`Deployment error:`, error);
        return NextResponse.json({ failure: "Failed to mint NFTs.", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
