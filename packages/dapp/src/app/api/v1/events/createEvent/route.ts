import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/db';

// const prisma = new PrismaClient()

interface IPropsal {
   event_type: string; // assuming event_type_enum is a string enum
   event_name?: string;
   event_category?: string; // assuming event_category_enum is a string enum
   event_start_time?: Date;
   symbol?: string;
   event_timezone?: string;
   event_location?: string;
   description?: string;
   contract_address?: string;
   event_end_time?: Date;
   cost?: number; // Decimal type in Prisma translates to number in TypeScript
   total_number_tickets?: number;
   // Additional properties for relations can be added if needed
}

interface EmailArray extends Array<string> {}

interface EmailStatus {
   exists: boolean;
   sent: boolean;
   status: number;
}

export async function POST(req: Request, res: NextResponse) {
   async function createEvent(propsal: IPropsal, user_id: string) {
      const {
         event_type,
         event_name,
         event_category,
         event_start_time,
         event_timezone,
         event_location,
         description,
         symbol,
         contract_address,
         event_end_time,
         cost,
         total_number_tickets,
      } = proposal;
      try {
         const event = await prisma.events.create({
            data: {
               //@ts-ignore
               event_type, // assumed to be a valid enum value or null
               event_name, // assumed to be a string or null
               user_id, // assumed to be a UUID string or null
               //@ts-ignore
               event_category, // assumed to be a valid enum value or null
               event_start_time, // converting to Date object
               event_timezone, // assumed to be a string or null
               event_location, // assumed to be a string or null
               description, // assumed to be a string or null
               event_end_time, // converting to Date object
               cost, // converting to Prisma's Decimal type
               total_number_tickets, // assumed to be an integer or null
               symbol,
               // ... other fields with their values
            },
         });
         //console.log(event.id)
         return event;
      } catch (error) {
         //console.log(`createEvent error : ${error}`)
         return 0;
      }
   }
   async function sendRequests(
      url: string,
      emailsArray: EmailArray,
      event_id: string
   ) {
      const data = {
         emailsArray,
         event_id,
      };
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: JSON.stringify(data),
      });
      return response.json();
   }
   async function createProposal(
      url: string,
      proposal: IPropsal,
      user_id: string,
      event_id: string
   ) {
      const data = {
         proposal,
         user_id,
         event_id,
      };

      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      });

      return response.json();
   }

   const requestBody = await req.json();

   const {
      user_id,
      proposal,
      emailsArray,
   }: // Add other fields from the proposal object here if necessary
   {
      user_id: string;
      event_type?: any; // or the specific enum type if defined
      event_name?: string;
      event_category?: any; // or the specific enum type if defined
      event_start_time: string; // assuming it's a Date object or string depending on how you're handling dates
      event_timezone?: string;
      event_location?: string;
      description?: string;
      contract_address?: string;
      event_end_time: string; // assuming it's a Date object or string
      cost?: number; // assuming it's a number type for decimal
      total_number_tickets?: number;
      proposal: IPropsal;
      emailsArray: EmailArray;
   } = requestBody;

   const numericCost = Number(proposal.cost);

   // Validate that numericCost is a number and not NaN
   if (isNaN(numericCost)) {
      return NextResponse.json({ status: 'number error' }, { status: 500 });
   }

   const {
      event_type,
      event_name,
      event_category,
      event_start_time,
      event_timezone,
      event_location,
      description,
      event_end_time,
      cost,
      total_number_tickets,
   } = proposal;

   const event = await createEvent(proposal, user_id);

   if (!event) {
      return NextResponse.json({ status: 'event error' }, { status: 500 });
   }

   const event_id = event.id;

   const newStakeholder = await prisma.stakeholders.create({
      data: {
         user_id: user_id,
         event_id: event_id,
      },
   });
   //console.log(`newStakeholder = ${newStakeholder.user_id}`)

   const url = 'http://localhost:3000/api/events/proposals';
   const prop = await createProposal(url, proposal, user_id, event_id);
   const url2 = 'http://localhost:3000/api/events/requests/sendRequests';
   const reqs = await sendRequests(url2, emailsArray, event_id);
   return NextResponse.json(
      { message: 'success', event, prop, reqs },
      { status: 200 }
   );
}
