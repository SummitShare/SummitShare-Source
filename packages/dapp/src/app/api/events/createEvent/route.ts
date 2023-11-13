import { PrismaClient, proposals } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../config/db'
// const prisma = new PrismaClient()

interface IPropsal {
    event_type: string; // assuming event_type_enum is a string enum
    event_name?: string;
    event_category?: string; // assuming event_category_enum is a string enum
    event_start_time?: Date;
    event_timezone?: string;
    event_location?: string;
    description?: string;
    contract_address?: string;
    event_end_time?: Date;
    cost?: number; // Decimal type in Prisma translates to number in TypeScript
    total_number_tickets?: number;
    // Additional properties for relations can be added if needed
  }

interface EmailStatus {
    exists: boolean;
    sent: boolean;
    status: number;
    }
interface EmailArray extends Array<string> {}


export async function POST(req: Request , res : NextResponse) {

  async function createEvent(propsal:IPropsal, user_id:string) {
    const {
      event_type,
      event_name,
      event_category,
      event_start_time,
      event_timezone,
      event_location,
      description,
      contract_address,
      event_end_time,
      cost,
      total_number_tickets,
    } = proposal;
    try {
      const event = await prisma.events.create({
    
        data:  {
          //@ts-ignore
            event_type, // assumed to be a valid enum value or null
            event_name, // assumed to be a string or null
            user_id,    // assumed to be a UUID string or null
            //@ts-ignore
            event_category, // assumed to be a valid enum value or null
            event_start_time, // converting to Date object
            event_timezone, // assumed to be a string or null
            event_location, // assumed to be a string or null
            description,    // assumed to be a string or null
            event_end_time, // converting to Date object
            cost, // converting to Prisma's Decimal type
            total_number_tickets, // assumed to be an integer or null
            // ... other fields with their values
          }
      }); 
      console.log(event.id)
      return event.id
      
    } catch (error) {
      console.log(`createEvent error : ${error}`)
      return 0
    }
  }
  async function sendRequests(url:string , stakeholders : EmailArray) {
    const response = await  fetch( url,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(stakeholders),
    })
    return response.json(); 
  }
  async function createProposal(url:string , proposal : IPropsal) {
    const response = await  fetch( url,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(stakeholders),
      })
    return response.json(); 
  }

  
    const requestBody = await req.json();

    const {
        user_id,
        proposal,
        stakeholders
        // Add other fields from the proposal object here if necessary
    }: {
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
        proposal:IPropsal;
        stakeholders: EmailArray;
    } = requestBody        

    const numericCost = Number(proposal.cost);

    // Validate that numericCost is a number and not NaN
    if (isNaN(numericCost)) {
      return NextResponse.json({ status: 'number error' ,}, { status: 500 })
    }

    // const eventID = await createEvent(proposal,user_id)


    // if (eventID == 0 ) {
    //   return NextResponse.json({ status: 'event error' ,}, { status: 500 })
    // }

    //-------TEST---------//

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
   const  userId = "1be3c37d-106c-49e0-9346-06ec291602a2"
    const event = await prisma.events.create({
      data: {
      //@ts-ignore//
        event_type,
        event_name,
        user_id,
        //@ts-ignore//
        event_category,
        event_start_time: new Date(),
        event_timezone,
        event_location,
        description,
        event_end_time: new Date(),
        cost: cost as number,
        total_number_tickets,
      },
    });

    return NextResponse.json(event.id, { status: 200 })
  
  
  // const urlRequests  = ""
  // const urlProposal = ""

  // const resRequests  = sendRequests(urlRequests,stakeholders)
  // const resProposal =createProposal(urlProposal,proposal)
  
}