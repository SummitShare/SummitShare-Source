/*
Category: Voting and Event Management
Purpose: Manages the voting process on proposals by stakeholders, updates event details, and stakeholder information based on the voting outcome. 
         This route facilitates a critical part of the governance mechanism, enabling stakeholders to have a say in proposal ratification and 
         ensuring the seamless update of event and stakeholder records upon proposal acceptance.
*/

import { NextResponse } from 'next/server'
import { PrismaClient, event_category_enum, event_type_enum } from '@prisma/client';
import { EventData, IStakes, StakeholderStakes } from '@/utils/dev/typeInit';
import prisma from '../../../../../../config/db';

/**
 * Updates the event ID for a proposal and its associated stakeholders in the database.
 * @param eventId - The ID of the newly created event.
 * @param proposal_id - The ID of the proposal being updated.
 * @returns A boolean indicating the success of the update operation.
 */

async function updateEventIdForProposalAndStakeholders(eventId: string, proposal_id: string): Promise<boolean> {
  try {
    console.log(`proposal to update ${proposal_id}`)

    // Start a transaction to ensure both updates are performed together
    await prisma.$transaction(async (prisma) => {

      // Update the proposal with the new event ID
      await prisma.proposals.update({
        where: { id: proposal_id },
        data: { event_id: eventId },
      });

      // Update all stakeholders associated with this proposal ID to the new event ID
      await prisma.stakeholders.updateMany({
        where: { proposal_id: proposal_id },
        data: { event_id: eventId },
      });
    });

    console.log('Successfully updated the proposal and associated stakeholders.');
    return true;
  } catch (error) {
    console.error('An error occurred during the update:', error);
    return false;
  }
}

/**
 * Maps email stakes to stakeholder stakes based on a proposal ID.
 * @param proposalId - The ID of the proposal.
 * @param emailStakes - A mapping of email addresses to stake percentages.
 * @returns A mapping of stakeholder IDs to stake percentages, or null in case of failure.
 */

async function mapEmailStakesToStakeholderStakes(
  proposalId: string,
  emailStakes: IStakes
): Promise<{ [stakeholderId: string]: number } | null> {
  try {
    const stakeholderStakes: { [stakeholderId: string]: number } = {};

    for (const [email, stake] of Object.entries(emailStakes)) {
      // Find user by email
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) continue;
      console.log(`proposal recieved  by map email${proposalId}`)
      // Find stakeholder by user ID and proposal ID
      const stakeholder = await prisma.stakeholders.findFirst({
        where: {
          user_id: user.id,
          proposal_id: proposalId,
        },
      });

      if (stakeholder) {
        // Map stake to stakeholder ID
        stakeholderStakes[stakeholder.stakeholder_id] = stake;
      }
    }

    console.log(`proposal after  by map email${proposalId}`)

    return stakeholderStakes;
  } catch (error) {
    console.error("Failed to map email stakes to stakeholder stakes:", error);
    return null; // Return null if the process fails
  }
}

/**
 * Updates the wallet addresses and stakes for stakeholders in the database.
 * @param stakeholderStakes - A mapping of stakeholder IDs to stake percentages.
 * @returns A boolean indicating the success of the update operation.
 */

async function updateWalletsAndStakes(
  stakeholderStakes: StakeholderStakes
): Promise<boolean> {
  try {
    let updated = false; // Track whether any updates were made

    for (const [stakeholderId, stake] of Object.entries(stakeholderStakes)) {
      // Fetch the stakeholder entry including the linked user
      const stakeholder = await prisma.stakeholders.findUnique({
        where: {
          stakeholder_id: stakeholderId,
        },
        include: {
          users: true, // Assuming you have set up the relation in Prisma schema
        },
      });

      // Check if stakeholder and linked user exist before proceeding
      if (stakeholder && stakeholder.users) {
        const userId = stakeholder.users.id;

        const walletAddress = await prisma.user_wallets.findFirst({
          where: {
            user_id: userId,
          },
        });

        await prisma.stakeholders.update({
          where: {
            stakeholder_id: stakeholderId,
          },
          data: {
            wallet_address: walletAddress?.wallet_address,
            stake: stake, // Combine both updates into a single call
          },
        });

        updated = true; // Mark as updated
      }
    }

    return updated; // Return true if any updates were made, false otherwise
  } catch (error) {
    console.error("An error occurred during update:", error);
    return false; // Explicitly return false in case of error
  }
}
    // Iterate over each stakeholderStakes entry

/**
 * POST handler for casting votes on proposals, creating events based on accepted proposals, and updating stakeholders.
 * @param req - The incoming HTTP POST request containing the vote and proposal details.
 * @returns A JSON response summarizing the outcome of the voting and update operations.
 */

export async function POST(req: Request, res: NextResponse) {
  try {
   // Extract relevant information from the request body
    const requestBody = await req.json();
    const { proposal_id, Vote, user_id }: { proposal_id: string; Vote: boolean; user_id: string } = requestBody;
    console.log(`proposal recieved ${proposal_id}`)

        /*
        The following operations are performed in this section of the script:

        1. **Proposal Validation**: It checks if the specified proposal exists and if it has a linked previous proposal ID. This step ensures that the proposal is valid and ready for voting.

        2. **User Validation**: It verifies the existence of the user casting the vote, ensuring that only registered users can participate in the voting process.

        3. **Vote Duplication Check**: It prevents users from casting multiple votes on the same proposal, maintaining the integrity of the voting process.

        4. **Vote Casting**: If the user hasn't already voted on the proposal, their vote is recorded. This action contributes to the collective decision-making process regarding the proposal.

        5. **Vote Evaluation**: After casting the vote, the script checks if all stakeholders have voted and if all votes are positive. This collective agreement is necessary for the proposal to be accepted.

        6. **Event Creation (if applicable)**: If the proposal is accepted (all stakeholders voted positively), the script proceeds to parse the proposal content and creates an event with the details specified in the proposal. This step translates the approved proposal into an actionable event within the platform.

        7. **Update Records**: Finally, it updates the event ID for the proposal and associated stakeholders, linking them to the newly created event. This update reflects the transition from proposal to execution upon acceptance.
        */

    // Retrieve and validate the proposal and user
    const proposal = await prisma.proposals.findUnique({
      where: { id: proposal_id },
    });

    if (!proposal || !proposal.previous_proposal_id) {
      return NextResponse.json({ error: 'Proposal or event not found' }, { status: 500 });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for existing vote and record the new vote
    const existingVote = await prisma.votes.findFirst({
      where: {
        proposal_id: proposal_id,
        user_id: user_id,
      },
    });

    if (existingVote) {
      return NextResponse.json({ error: 'user has voted already' }, { status: 401 });
    }

    const vote = await prisma.votes.create({
      data: {
        proposal_id,
        user_id,
        decision: Vote,
      },
    });

    const allVotes = await prisma.votes.findMany({ where: { proposal_id: proposal_id } });
    const stakeholders = await prisma.stakeholders.findMany({ where: { proposal_id: proposal_id } });

    const allStakeholdersVotedPositively =
      stakeholders.length > 0
      && allVotes.length === stakeholders.length
      && allVotes.every(vote => vote.decision === true);

    // Evaluate if all stakeholders voted positively
    if (allStakeholdersVotedPositively) {
      // Proceed with event creation and record updates:
      if (typeof proposal.content === 'string' && proposal.content !== null) {
    
        const propData: EventData = JSON.parse(proposal.content);

        const stakeholderStakes = await mapEmailStakesToStakeholderStakes(proposal_id,propData.stakes)
        if(stakeholderStakes){
          const status = await updateWalletsAndStakes(stakeholderStakes)

          if(status == false ){
            return  NextResponse.json({ "message": "failed to update stake holders", proposal,status }, { status: 200 });
          }
          
        }
        
        const eventType: event_type_enum = propData.event_type as event_type_enum
        const event_category: event_category_enum = propData.event_category as event_category_enum;

        const event = await prisma.events.create({
          
          data: {
            user_id: proposal.user_id,
            event_type: eventType,
            event_name: propData.event_name,
            event_category: event_category,
            event_start_time: new Date(propData.event_start_time),
            event_timezone: propData.event_timezone,
            event_location: propData.event_location,
            description: propData.description,
            event_end_time: new Date(propData.event_end_time),
            cost: propData.cost,
            total_number_tickets: propData.total_number_tickets
          }
        });

        const statusUpdate = await updateEventIdForProposalAndStakeholders(event.id,proposal.id)
        return NextResponse.json({ message: "Proposal accepted and event updated", event, "updateStatus": statusUpdate , user, vote, }, { status: 200 });
      }

      return NextResponse.json({ message: "Proposal accepted and event updated", proposal, user, vote, }, { status: 200 });
    } else {                                                                                                                                                       
      // return NextResponse.json({ message: "Not all parties have voted positively" }, { status: 200 });
      return NextResponse.json({ proposal, Vote, user, vote }, { status: 200 });
    }


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}


