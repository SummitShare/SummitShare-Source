import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { transporter,emailServer } from '../../../../../config/nodemailer'
import prisma from '../../../../../config/db'
import crypto from 'node:crypto'

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
    symbol?: string;
    // Additional properties for relations can be added if needed
}
type ExhibitParams = {
    name : string;
    symbol : string;
    ticketPrice : string;
    beneficiaries : string[];
    shares: number[];
    baseURI: string;
    location: string;
    artifactNFT: string;
    details: string;
    id: string;
};

  
interface EmailArray extends Array<string> {}
interface IPropsal extends Object{}


export async function POST(req: Request, res: NextResponse) {
    
    try {
        const requestBody = await req.json();
        const {  event_id }: { event_id: string ,  } = requestBody;
        const eventData = await prisma.events.findUnique({
            where: { id: event_id },
            include: {
                stakeholders: true // Include stakeholders related to the event
            }
        });
        
        if (!eventData) {
            throw new Error('Event not found');
        }
        
        // Map the event data to ExhibitParams
        const exhibitParams: ExhibitParams = {
            name: eventData.event_name || 'Default Name', 
            symbol: eventData.symbol || 'Default Symbol',  
            ticketPrice: eventData.cost?.toString() || '0',  
            beneficiaries: eventData.stakeholders.map(stakeholder => stakeholder.wallet_address|| 'Default Wallet ID'),  
            shares: eventData.stakeholders.map(stakeholder => stakeholder.stake || 0),  
            baseURI: 'your-base-uri', 
            location: eventData.event_location || 'Default Location',  
            artifactNFT: 'your-artifact-nft', 
            details: eventData.description || 'Default Details',  
            id: eventData.id
        };
        


        // Return the status of all operations
        return NextResponse.json(exhibitParams, { status: 200 });
      } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
      }
  }