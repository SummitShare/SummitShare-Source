/*
Category: API Layer
Purpose: Handles the creation of new proposals for events, updating stakeholders with the new proposal details, and ensuring all stakeholders are accounted for correctly within the table. This script is integral to the governance and decision-making process within the application, allowing users to submit proposals for changes or new initiatives that require collective approval.
*/

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { EmailStatus, IPropsal, IStakes, EmailArray } from '@/utils/dev/typeInit';
import prisma from '../../../../../../config/db';



  /**
   * Updates the proposal ID for all stakeholders associated with a previous proposal to a new proposal ID.
   * 
   * @param previousProposalId - The ID of the previous proposal associated with the stakeholders.
   * @param newProposalId - The ID of the new proposal to associate with the stakeholders.
   * @returns A boolean indicating the success of the update operation.
   */

  async function updateStakeholderProposals( previousProposalId : string, newProposalId : string): Promise<boolean> {
    try {
      const result = await prisma.stakeholders.updateMany({
        where: {
          proposal_id: previousProposalId, // Filter stakeholders by the previous proposal ID
        },
        data: {
          proposal_id: newProposalId, // Set the new proposal ID
        },
      });
  
      console.log(`Successfully updated ${result.count} stakeholders.`);
      return true;
    } catch (error) {
      console.error("An error occurred during the update:", error);
      return false
    }
  }

  /**
 * Ensures that all stakeholders specified in the stakes object are present in the database and their total shares equal 100%.
 * 
 * @param stakes - An object mapping stakeholder email addresses to their stake percentages.
 * @param proposal_id - The ID of the proposal these stakeholders are associated with.
 * @returns A boolean indicating whether the stakeholders are correctly represented in the table.
 */

async function ensureStakeholdersInTable(stakes: IStakes ,proposal_id : string) : Promise<boolean> {
  // Guard clause to check if companyStakes is empty
  if (Object.keys(stakes).length === 0) {
  
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
          proposal_id: proposal_id
      }
  });

  if (!CurrentStakeholder) {
      throw new Error(`Stakeholder not found for user ID: ${user.id} and event ID: ${proposal_id}`);
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

/**
 * POST handler for creating new proposals.
 * Validates stakeholder information, creates a new proposal in the database, and updates stakeholders with the new proposal ID.
 * 
 * @param req - The incoming HTTP POST request containing the new proposal data.
 * @returns A JSON response indicating the outcome of the proposal creation process.
 */

export async function POST(req: Request, res: NextResponse) {
    try {

        const requestBody = await req.json();
        const { proposal , proposal_id , user_id , stakes }: { proposal: IPropsal, proposal_id: string , user_id:string  , stakes :IStakes} = requestBody;
        const stakeholderIds = Object.keys(stakes); 

        if (Object.keys(stakes).length === 0) {
          console.log("The companyStakes object is empty.");
          return NextResponse.json({ error: 'no stakeholders sent' }, { status: 400 });
        }

        const stakesValidated = await ensureStakeholdersInTable(stakes,proposal_id)
        if (stakesValidated == false) {
          return NextResponse.json({ error: "invalid or missing stakeholders please ensure all stakeholders have accepted the requesrs " }, { status: 400 });
        }

      // Append stakes to the proposal object if stakesValidated is true
      if (stakesValidated) {
        proposal.stakes = stakes;
      }

    const prop = JSON.stringify(proposal);
    const newProposal = await prisma.proposals.create({
        data:{
          user_id: user_id,
          content: prop,
          previous_proposal_id:proposal_id,
        }
    })

    const newVote = await prisma.votes.create({
      data: {
          user_id: user_id,
          proposal_id: newProposal.id, // Using the ID of the newly created proposal
          decision: true // Automatically approve the new proposal by the creator.
      }
    });

    const status = await updateStakeholderProposals(proposal_id, newProposal.id)
     if (!status) {
      return NextResponse.json({"message ":"error updating stakeholders"},{ status: 500 });
     }

      // Return the status of all operations
      return NextResponse.json({newProposal},{ status: 200 });
    } catch (error) {
      console.error('Error in POST endpoint:', error);
      return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
  }