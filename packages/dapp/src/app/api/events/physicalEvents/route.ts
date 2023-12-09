import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

const prisma = new PrismaClient()

export async function GET(req: Request, res: NextResponse) {
    try {
        // Parse the request body
        const requestBody = await req.json();
        const { event_id, user_id }: { event_id: string, user_id: string } = requestBody;

        // Find the most recent proposal for the given event_id
        const events = await prisma.events.findMany({
            where: {
                event_type: 'Physical',
            },

            // orderBy: {
            //     created_at: 'desc'
            // }
            
        });

        if (!events) {
            return NextResponse.json({ error: 'No proposal found for the given event ID' }, { status: 404 });
        }


        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
