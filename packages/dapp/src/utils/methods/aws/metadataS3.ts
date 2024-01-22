
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
interface UploadData {
    name: string;
    data: Buffer | Uint8Array | Blob | string | ReadableStream;
}


function getEnvVariable(key: string): string {
    const value = process.env[key];
    if (typeof value === 'string') {
        return value;
    } else {
        // Throw an error or handle the undefined case appropriately
        throw new Error(`Environment variable ${key} is not set`);
    }
}

// Use the function to get your environment variables
const awsRegion = getEnvVariable('AWS_REGION');
const awsAccessKey = getEnvVariable('AWS_ACCESS_KEY');
const awsSecretKey = getEnvVariable('AWS_SECRET_KEY');
const awsBucketName = getEnvVariable('AWS_BUCKET_NAME');

// Now you can use these variables to create your S3 client
const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
    },
});

export async function uploadMetadataS3(uploadData: UploadData) {
    const { name, data } = uploadData;

    const putObjectParams = {
        Bucket: awsBucketName,
        Key: name,
        Body: data
    };

    try {
        const command = new PutObjectCommand(putObjectParams);
        const response = await s3Client.send(command);
        console.log("Successfully uploaded:", name);
        return response;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}