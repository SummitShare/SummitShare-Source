import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { transporter,emailServer } from '../../../../../config/nodemailer'
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
    symbol?: string;
    // Additional properties for relations can be added if needed
  }

  
interface EmailArray extends Array<string> {}
interface IPropsal extends Object{}


export async function POST(req: Request, res: NextResponse) {
    try {
        // Parse the request body
        
        const requestBody = await req.json();
        const { proposal , event_id , user_id }: { proposal: IPropsal, event_id: string , user_id:string  } = requestBody;
        const prop = JSON.stringify(proposal)

        const newProposal = await prisma.proposals.create({
            data:{
              user_id: user_id,
              event_id: event_id,
              content: prop
            }
        })

        const newVote = await prisma.votes.create({
          data: {
              user_id: user_id,
              proposal_id: newProposal.id, // Using the ID of the newly created proposal
              decision: true
          }
      });


        // Return the status of all operations
        return NextResponse.json(newProposal, { status: 200 });
      } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
      }
  }