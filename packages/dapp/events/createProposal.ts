import prisma from "../config/db";
import { NextApiResponse } from 'next';
import validateProposal from "./validateProposal";
import { IpcNetConnectOpts } from "net";


interface IPropsal {
    event_type: EventType; // assuming event_type_enum is a string enum
    event_name: string;
    event_category: EventCategory; // assuming event_category_enum is a string enum
    event_start_time: Date;
    event_timezone: string;
    event_location: string;
    description: string;
    event_end_time: Date;
    cost: number; // Decimal type in Prisma translates to number in TypeScript
    total_number_tickets: number;
    // Additional properties for relations can be added if needed
}

type EventType = "Physical" | "Virtual";
type EventCategory = "solo_exhibitions" | "group_exhibitions" | "museum_exhibitions" | "art_event_exhibitions";

export default async function createProposal(event_id: string | null, user_id: string | null, proposal: IPropsal, res: NextApiResponse) {
    // Assuming that 'content' is the proposal details and needs to be validated
    const validationError = validateProposal(proposal);
    if (validationError) {
        res.status(400).json({ error: validationError });
        return;
    }

    const content = JSON.stringify(proposal);

    try {
        // Assuming that 'proposals' is the name of the table in your Prisma schema
        const createdProposal = await prisma.proposals.create({
            data: {
                event_id, // Can be null
                user_id,  // Can be null
                content,  // JSON content of the proposal
                // No need to set 'id' and 'created_at', as they are managed by the database
            },
        });

        console.log(createdProposal.id);
        res.status(200).json(createdProposal);
    } catch (error) {
        console.error(`createProposal error: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}