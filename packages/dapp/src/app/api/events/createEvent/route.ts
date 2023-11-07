import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function POST(req: Request , res : NextResponse) {

    if (req.method === 'POST') {
        
    try {
     // Destructure fields from req.body
        const {
        event_type,
        event_name,
        user_id,
        event_category,
        event_start_time,
        event_timezone,
        event_location,
        description,
        contract_address,
        event_end_time,
        cost,
        total_number_tickets,
        // ... other fields you expect to receive
        } = await req.json();

        // Ensure cost is a number
        const numericCost = Number(cost);

        // Validate that numericCost is a number and not NaN
        if (isNaN(numericCost)) {
            return NextResponse.json({ status: 'number error' ,}, { status: 200 })
        }
        // TODO: Add any necessary validation for the received fields

        // Create a new event record
        const event = await prisma.events.create({
        data: {
            event_type, // assumed to be a valid enum value or null
            event_name, // assumed to be a string or null
            user_id,    // assumed to be a UUID string or null
            event_category, // assumed to be a valid enum value or null
            event_start_time: new Date(event_start_time), // converting to Date object
            event_timezone, // assumed to be a string or null
            event_location, // assumed to be a string or null
            description,    // assumed to be a string or null
            contract_address, // assumed to be a string or null
            event_end_time: new Date(event_end_time), // converting to Date object
            cost: numericCost, // converting to Prisma's Decimal type
            total_number_tickets, // assumed to be an integer or null
            // ... other fields with their values
        }

       
        });
        const event_id = event.id


        } catch (error) {
            return NextResponse.json({ yes: 'great success' ,}, { status: 200 })
        }
      } else {
        return NextResponse.json({ fail: 'fail' ,}, { status: 200 })
      }
    


}