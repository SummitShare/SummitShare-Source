// import { PrismaClient } from '@prisma/client'
// import { NextResponse } from 'next/server'
// import { transporter,emailServer } from '../../../../../config/nodemailer'
// import crypto from 'node:crypto'

// const prisma = new PrismaClient()
// interface EmailStatus {
//     exists: boolean;
//     sent: boolean;
//     status: number;
// }
// interface IPropsal {
//     event_type?: string; // assuming event_type_enum is a string enum
//     event_name?: string;
//     user_id?: string;
//     event_category?: string; // assuming event_category_enum is a string enum
//     event_start_time?: Date;
//     event_timezone?: string;
//     event_location?: string;
//     description?: string;
//     contract_address?: string;
//     event_end_time?: Date;
//     cost?: number; // Decimal type in Prisma translates to number in TypeScript
//     total_number_tickets?: number;
//     // Additional properties for relations can be added if needed
//   }
// interface EmailArray extends Array<string> {}


// export async function POST(req: Request, res: NextResponse) {
//     try {
//         // Parse the request body
        
//         const requestBody = await req.json();
//         const { proposal , eventID , user_id }: { proposal: IPropsal, eventID: string , user_id:string } = requestBody;

//         const newProposal = prisma.proposals.create({
//             data:{
//                 event_type: proposal.event_type || "Physical",
//                 event_name: "Annual Tech Conference",
//                 user_id: user_id,
//                 event_category: proposal.event_category,
//                 event_start_time: proposal.event_start_time,
//                 event_timezone: proposal.event_timezone,
//                 event_location: proposal.event_location,
//                 description: proposal.contract_address,
//                 contract_address: proposal.contract_address,
//                 event_end_time: proposal.event_end_time,
//                 cost: proposal.cost,
//                 total_number_tickets: proposal.total_number_tickets
//             }
//         })



    
        
//         // Iterate over the array of emails
        


//         // Return the status of all operations
//         return NextResponse.json(newProposal, { status: 200 });
//       } catch (error) {
//         console.error('Error in POST endpoint:', error);
//         return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
//       }
//   }