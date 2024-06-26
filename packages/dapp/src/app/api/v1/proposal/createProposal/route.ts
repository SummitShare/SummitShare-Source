/*
Category: Governance and Voting System
Purpose: This script facilitates the governance process within the application by allowing users to submit proposals. 
These proposals are subject to stakeholder review and voting, reflecting the decentralized decision-making process.
The script includes functionality to validate stakeholder representations and automatically approve the submission 
of a new proposal by the creator, ensuring a streamlined proposal creation and approval workflow.
*/

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { IPropsal, IStakes, EmailStatus } from '@/utils/dev/typeInit';

const prisma = new PrismaClient()

/**
 * Ensures that all specified stakeholders are properly represented in the table
 * and that their total stakes equal 100%.
 * @param stakes - An object mapping stakeholders to their respective stakes.
 * @param proposal_id - The unique identifier of the proposal to which the stakeholders are linked.
 * @returns A promise that resolves to a boolean indicating whether the stakeholder representation is valid.
 */

async function ensureStakeholdersInTable(stakes: IStakes ,proposal_id : string) : Promise<boolean> {
  // Guard clause to check if companyStakes is empty
  if (Object.keys(stakes).length === 0) {
    //console.log("The companyStakes object is empty.");
    return false; // Return false if companyStakes is empty
  }

  const totalStakes = Object.values(stakes).reduce((total, stake) => total + stake, 0);
  // Validation for total stakes
  if (totalStakes !== 100) {
    //console.log(`The total stakes do not add up to 100. Current total: ${totalStakes}`);
    return false; // Return false if total stakes do not add up to 100
  }

  const emails = Object.keys(stakes); // Get all stakeholder IDs from the Stakes object
  // Verifies each stakeholder's presence in the database and their association with the proposal
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
          event_id: proposal_id
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
      //console.log(`Stakeholder with ID ${CurrentStakeholder.stakeholder_id} not found in the database.`);
      return false; // Return false if a stakeholder is not found in the database
    } else {
      //console.log(`Stakeholder with ID ${CurrentStakeholder.stakeholder_id} exists in the database.`);
      // Continue checking other stakeholders
    }
  }
  return true; // Return true if all checks pass
}


/**
 * POST handler for creating new proposals.
 * 
 * This endpoint allows users to submit new proposals, which are then recorded in the database.
 * A corresponding vote is automatically created to signify the submitter's approval of the proposal.
 * 
 * @param req - The incoming HTTP POST request containing the proposal details.
 * @returns A JSON response containing the newly created proposal or an error message.
 */

export async function POST(req: Request, res: NextResponse) {
    try {
        // Parse the request body
        const requestBody = await req.json();
        const { proposal ,user_id ,  }: { proposal: IPropsal,  user_id:string  } = requestBody;
        if (!proposal || !user_id) {
          return NextResponse.json({ message: 'no proposal or user id sent' }, { status: 404 });
        }
        // Serializes the proposal object to store as a string in the database
        const prop = JSON.stringify(proposal);

        // Creates a new proposal record in the database
        const newProposal = await prisma.proposals.create({
            data:{
              user_id: user_id,
              content: prop,
            }
        })

      // Automatically creates a vote in favor of the new proposal by the submitter
        const newVote = await prisma.votes.create({
          data: {
              user_id: user_id,
              proposal_id: newProposal.id, // Using the ID of the newly created proposal
              decision: true
          }
      });
        // Responds with the newly created proposal
        return NextResponse.json(newProposal, { status: 200 });
      } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
      }
  }