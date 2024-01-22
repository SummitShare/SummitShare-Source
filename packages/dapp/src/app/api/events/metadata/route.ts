import { NextResponse } from "next/server";
import { uploadMetadataS3 } from "@/utils/methods/aws/metadataS3";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const name = data.name;
        const fileName = `${name}.json`;

        // Define the bucket name
        const bucketName = 'your-s3-bucket-name'; // Replace with your actual bucket name

        // Call the upload function
        await uploadMetadataS3(data);

        return NextResponse.json({ success: true, fileName });
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}