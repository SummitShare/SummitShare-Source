import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../../config/db'
import crypto from 'node:crypto'
import { deployArtifactNFT,mintNFT } from '@/functonality/artifactNFTcall'

type ArtifactNFTDeployment = {
    name : string,
    symbol : string,
    ownerAddress : string,
    baseURIParam : string; 
}

type ArtifactNFTMinting = {
    recipientAddress : string,
    mintQuantity : number;
}



export async function GET(req: Request) {

    const deploymentParams: ArtifactNFTDeployment = {
        name: "LeadingLadies",
        symbol: "LLEZ",
        ownerAddress: "0x2c455e30e4E47A4458A4df9f36494F75FbDc0e7f", 
        baseURIParam: "https://s3.tebi.io/summitsharemetadata/leadingLadies/"
    };
    try {
        
      const  receipt  = await deployArtifactNFT(deploymentParams)


       const mintParams: ArtifactNFTMinting ={
        recipientAddress: "0x2c455e30e4E47A4458A4df9f36494F75FbDc0e7f",
        mintQuantity:6
       };

       
      const receipt2 = await mintNFT(mintParams,"0xdFB611127315848Fd0D53226eC886BbF6514B5D1")
       
        return NextResponse.json({
            "deploy receipt":receipt,
            "<-------------->":"<-------------->",
           " mint receipt": receipt2
        } ,{ status: 200 });
    } catch (error) {
        console.error('Error in deploy POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
