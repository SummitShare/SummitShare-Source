import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import S3 from 'aws-sdk/clients/s3'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto';

dotenv.config({path: '.env.local' });



const s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4'
})


const prisma = new PrismaClient()

export async function GET (request: Request , response : NextResponse) {

    const Key =`${randomUUID()}.jpg`
    const bucket = process.env.AWS_BUCKET_NAME
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key,
      Expires: 60,   
      ContentType: `image/jpg`
    }

    const uploadUrl = s3.getSignedUrl('putObject',s3Params)


    // const allUsers = await prisma.users.findMany()
    // console.log(allUsers)
    // console.log("get")
    return NextResponse.json({ 
      yes: 'great success' ,
      key : Key,
      url : uploadUrl
    }, { status: 200 })
}