import { NextResponse } from 'next/server';
import prisma from '../../../../../config/db';

export async function POST(req: Request) {
    try {
        const { url, event_id }: { url: string, event_id: string } = await req.json();

        // Validate input data (optional, but recommended)
        // ...

        const newEventImage = await prisma.event_images.create({
            data: {
                s3_url: url,
                event_id: event_id
            }
        });

        return NextResponse.json({ status: 'ok', url: url }, { status: 200 });
    } catch (error) {
        console.error('Error in event image POST endpoint:', error);
        return NextResponse.json({ error: 'Error creating event image.' }, { status: 500 });
    }
}
