import prisma from "../config/db";
import { NextApiResponse } from 'next';
import validateProposal from "./validateProposal";

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

export default async function createEvent(proposal:IPropsal, user_id:string, res: NextApiResponse) {
  validateProposal(proposal)

  const validationError = validateProposal(proposal);
  if (validationError) {
      res.status(400).json({ error: validationError });
      return;
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

  try {
    // Destructuring directly in the prisma call for clarity
    const event = await prisma.events.create({
        data: {
          ...proposal,
          user_id, // assuming user_id is a valid UUID
          // Ensure other necessary transformations or validations are handled
        },
      });

      console.log(event.id);
      res.status(200).json(event);
  } catch (error) {
      console.error(`createEvent error: ${error}`);
      // Adjust the error message and status code based on the nature of the error
      res.status(500).json({ error: 'Internal Server Error' });
  }

}