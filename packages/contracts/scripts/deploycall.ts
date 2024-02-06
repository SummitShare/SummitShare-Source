import { ethers } from "hardhat";
import axios from 'axios';

async function main() {
    // Signer accounts
    const [deployer] = await ethers.getSigners();

    // Deployment parameters
    const nftName = "leadingLadies";
    const nftSymbol = "LLE";
    const ownerAddress = deployer.address; // Using deployer as owner for test purposes
    const baseURIParam = "https://s3.tebi.io/summitsharemetadata/leadingLadies";

    console.log("Deploying ArtifactNFT contract...");

    // Deploying the ArtifactNFT contract
    try {
        const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
        const artifactNFT = await ArtifactNFT.deploy(nftName, nftSymbol, ownerAddress, baseURIParam);
        

        console.log(`ArtifactNFT deployed to: ${artifactNFT.address}`);

        // Check if the contract has been deployed
        if (artifactNFT.address) {
        console.log(`ArtifactNFT deployed to: ${artifactNFT.address}`);
     
         } else {
        console.error("ArtifactNFT deployment failed.");
      }

               // Minting parameters
               const recipientAddress = deployer.address; // Address receiving the NFTs
               const mintQuantity = 3; // Number of NFTs to mint
       
               console.log(`Minting ${mintQuantity} NFTs to ${recipientAddress}...`);
       
               // Minting NFTs
               const mintTx = await artifactNFT.mint(recipientAddress, mintQuantity);
               const receipt = await mintTx.wait(6);
       
               console.log(`Mint transaction successful! Transaction hash: ${receipt.transactionHash}`);

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
               // Additional receipt details can be logged as needed
           } catch (error) {
               console.error("Operation failed:", error);
               process.exit(1); // Exit with an error code
           }
       }

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});
