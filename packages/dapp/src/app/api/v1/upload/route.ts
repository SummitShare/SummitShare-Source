import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

export async function POST(req: NextRequest) {
   const { filename, contentType } = await req.json();

   if (!filename || !contentType) {
      return NextResponse.json(
         { error: 'filename and contentType are required' },
         { status: 400 }
      );
   }

   const key = `${Date.now()}-${filename}`;

   const uploadUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
         Bucket: R2_BUCKET,
         Key: key,
         ContentType: contentType,
      }),
      { expiresIn: 3600 }
   );

   return NextResponse.json({
      uploadUrl,
      publicUrl: `${R2_PUBLIC_URL}/${key}`,
   });
}
