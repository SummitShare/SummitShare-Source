// src/pages/api/deployDonations.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import DonationsContract from '../../../utils/artifacts/contracts/Donations.sol/Donations.json';
import { initializeWallet } from '@/utils/dev/walletInit';
// import { PrismaClient } from '@prisma/client';


const { abi, bytecode } = DonationsContract;
// POST Handler for deploying the Donations Contract
export async function POST(req: Request) {
  try {
    const { communityWalletAddress }: { communityWalletAddress: string } = await req.json();

    // Validate the community wallet address
    if (!ethers.utils.isAddress(communityWalletAddress)) {
      return NextResponse.json({ error: 'Invalid community wallet address provided.' }, { status: 400 });
    }

    // Initialize the wallet using your preferred method (e.g., with a private key or a mnemonic)
    const wallet = initializeWallet();

    // Create a contract factory
    const donationsFactory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy the Donations contract
    const donationsContract = await donationsFactory.deploy(process.env.PROJECT_WALLET_ADDRESS, communityWalletAddress);
    await donationsContract.deployed();

    // Return success response with the contract address
    return NextResponse.json({ success: 'Contract deployed successfully', contractAddress: donationsContract.address }, { status: 201 });
  } catch (error) {
    console.error('Error deploying the Donations contract:', error);
    return NextResponse.json({ error: 'Failed to deploy the Donations contract' }, { status: 500 });
  }
}