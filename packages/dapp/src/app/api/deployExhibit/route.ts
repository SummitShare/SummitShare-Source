/*
Category: Blockchain Interaction Layer - API
Purpose: Deploys an exhibit onto chain and posts the deployed exhibit's address onto the PostGres DB
*/

import { contracts } from '@/utils/dev/contractInit';
import type { ExhibitParams, TransactionReceipt } from '@/utils/dev/typeInit'; 
import prisma from "../../../../config/db";
import { NextApiRequest } from 'next';
import { NextResponse } from "next/server";
import { ethers } from 'ethers';

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
async function deployExhibit(exhibitParams : ExhibitParams) {
    try {
        // Validating input parameters
        validateExhibitParams(exhibitParams);

        // Use the modular approach to get the EventOrganizerService contract
        const organizerServiceContract = contracts.getEventOrganizerService();

        const tx = await organizerServiceContract.organizeExhibit(
            exhibitParams.name,
            exhibitParams.symbol, 
            exhibitParams.ticketPrice,
            exhibitParams.beneficiaries,
            exhibitParams.shares,
            exhibitParams.baseURI,
            exhibitParams.location,
            exhibitParams.artifactNFT,
            exhibitParams.details,
            exhibitParams.id
        );

        const receipt0 = await tx.wait(6)
        return receipt0;

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


// POST Handler for API Route
export async function POST(req: Request) {
    try {
        // Validate and parse the request body
        const { event_id } : { event_id: string } = await req.json();
        //console.log(event_id)

        // Call API or function to get exhibit parameters based on the event_id
        const exhibitParams = await callDeployEventApi(event_id);

        // Deploy the exhibit using the retrieved parameters
        const receipt: TransactionReceipt = await deployExhibit(exhibitParams);
        //console.log(receipt.logs[2].address);
        const contract_address = receipt.logs[2].address

        // posts to database deployed exhibitid/address
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





    