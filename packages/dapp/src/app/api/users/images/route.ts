import { NextResponse } from 'next/server';
import prisma from '../../../../../config/db';

export async function POST(req: Request) {
    try {
        // Parse the request body to include the optional gallery_index
        const { url, user_id, imageType, gallery_index }: { url: string, user_id: string, imageType: 'Profile' | 'Gallery' | 'Cover', gallery_index?: number } = await req.json();


        // Prepare the data object for database insertion
        const imageData = {
            s3_url: url,
            user_id: user_id,
            image_type: imageType,
            ...(gallery_index !== undefined && { gallery_index: gallery_index }) // Add gallery_index only if it's present
        };

        // Create a new user image record in the database
        const newUserImage = await prisma.user_images.create({
            data: imageData
        });

        // Return a success response with the image URL
        return NextResponse.json({ status: 'ok', url: url }, { status: 200 });
    } catch (error) {
        console.error('Error in user image POST endpoint:', error);
        // Return an error response
        return NextResponse.json({ error: 'Error creating user image.' }, { status: 500 });
    }
}
