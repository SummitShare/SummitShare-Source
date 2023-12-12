import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import crypto from 'node:crypto';
import { access } from 'node:fs';
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
  const { filename, contentType } = await request.json()

  console.log('uploading filename', filename)

  try {
    console.log('uploading to bucket ', process.env.AWS_BUCKET_NAME)
    ///const client = new S3Client({ region: process.env.AWS_REGION })

 
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID!
    const accessKeySecret = process.env.AWS_SECRET_ACCESS_KEY!
    const region = process.env.AWS_REGION!
    const bucketName = process.env.AWS_BUCKET_NAME!
    
    const client = new S3Client({
      region: region,
      credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: accessKeySecret,
      },
      });
    console.log('uploading client', client)
    const { url, fields } = await createPresignedPost(client, {
      Bucket: bucketName,
      Key: crypto.randomUUID(),
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 3600, // Seconds before the presigned post expires. 3600 by default.
    })
    console.log('uploading url', url) 
    console.log(fields)
    return NextResponse.json({ url, fields },{ status: 400 })
  } catch (error ) {
    console.log('uploading error', error)
    return NextResponse.json({ error: "error getting pre signed ur"},{ status: 500 }) 
  }
}
