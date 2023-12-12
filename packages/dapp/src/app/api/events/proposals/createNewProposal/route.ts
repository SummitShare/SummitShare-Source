import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { transporter,emailServer } from '../../../../../../config/nodemailer'
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
    symbol?: string;
    description?: string;
    event_timezone?: string;
    event_end_time?: Date;
    cost?: number;
    stakes: IStakes; // Decimal type in Prisma translates to number in TypeScript
    total_number_tickets?: number;
    // Additional properties for relations can be added if needed
  }

  interface IStakes {
    [stakeholder: string]: number;
  }

async function ensureStakeholdersInTable(stakes: IStakes ,event_id : string) : Promise<boolean> {
  // Guard clause to check if companyStakes is empty
  if (Object.keys(stakes).length === 0) {
    console.log("The companyStakes object is empty.");
    return false; // Return false if companyStakes is empty
  }

  const totalStakes = Object.values(stakes).reduce((total, stake) => total + stake, 0);

  // Validation for total stakes
  if (totalStakes !== 100) {
    console.log(`The total stakes do not add up to 100. Current total: ${totalStakes}`);
    return false; // Return false if total stakes do not add up to 100
  }

  const emails = Object.keys(stakes); // Get all stakeholder IDs from the Stakes object


  for (const email of emails) {
    const user = await prisma.users.findUnique({
      where: { email: email }
  });

  if (!user) {
      throw new Error(`User not found for email: ${email}`);
  }

  // Find the stakeholder ID for the user and event
  const CurrentStakeholder = await prisma.stakeholders.findFirst({
      where: {
          user_id: user.id,
          event_id: event_id
      }
  });

  if (!CurrentStakeholder) {
      throw new Error(`Stakeholder not found for user ID: ${user.id} and event ID: ${event_id}`);
  }
    


    const stakeholder = await prisma.stakeholders.findUnique({
      where: {
        stakeholder_id: CurrentStakeholder.stakeholder_id,
      },
    });

    if (!stakeholder) {
      console.log(`Stakeholder with ID ${CurrentStakeholder.stakeholder_id} not found in the database.`);
      return false; // Return false if a stakeholder is not found in the database
    } else {
      console.log(`Stakeholder with ID ${CurrentStakeholder.stakeholder_id} exists in the database.`);
      // Continue checking other stakeholders
    }
  }

  return true; // Return true if all checks pass
}

  
interface EmailArray extends Array<string> {}
interface IPropsal extends Object{}


export async function POST(req: Request, res: NextResponse) {
    try {
        // Parse the request body
        
        const requestBody = await req.json();
        const { proposal , event_id , user_id , stakes }: { proposal: IPropsal, event_id: string , user_id:string  , stakes :IStakes} = requestBody;
        

        const stakeholderIds = Object.keys(stakes); 

        if (Object.keys(stakes).length === 0) {
          console.log("The companyStakes object is empty.");
          return NextResponse.json({ error: 'no stakeholders sent' }, { status: 400 });
        }

        const stakesValidated = await ensureStakeholdersInTable(stakes,event_id)
        if (stakesValidated == false) {
          return NextResponse.json({ error: 'wrong stakeholder format ' }, { status: 400 });
        }

        // Append stakes to the proposal object if stakesValidated is true
      if (stakesValidated) {
        proposal.stakes = stakes;
      }

const prop = JSON.stringify(proposal);

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