import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

const prisma = new PrismaClient()
interface EmailStatus {
    exists: boolean;
    sent: boolean;
    status: number;
}
interface IPropsal {
    event_type?: string; // assuming event_type_enum is a string enum
    event_name?: string;
    event_category?: string; // assuming event_category_enum is a string enum
    event_start_time?: Date;
    event_location?: string;
    description?: string;
    event_timezone?: string;
    event_end_time?: Date;
    cost?: number; // Decimal type in Prisma translates to number in TypeScript
    total_number_tickets?: number;
    // Additional properties for relations can be added if needed
  }
interface EmailArray extends Array<string> {}
interface IPropsal extends Object{}


export async function POST(req: Request, res: NextResponse) {
    try {
        // Parse the request body
        const requestBody = await req.json();
        const { event_id, user_id }: { event_id: string, user_id: string } = requestBody;

        // Find the most recent proposal for the given event_id
        const recentProposal = await prisma.proposals.findFirst({
            where: {
                event_id: event_id
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (!recentProposal) {
            return NextResponse.json({ error: 'No proposal found for the given event ID' }, { status: 404 });
        }

        return NextResponse.json({ recentProposal }, { status: 200 });
    } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
