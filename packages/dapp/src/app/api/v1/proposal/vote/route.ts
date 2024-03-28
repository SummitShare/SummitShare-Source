import { NextResponse } from 'next/server'
import { PrismaClient, event_category_enum, event_type_enum } from '@prisma/client';
import { ISwapRouter__factory } from '@/utils/typechain-types';
const prisma = new PrismaClient();

interface IStakes {
  [stakeholder: string]: number;
}

interface EventData {
  event_type: string;
  event_name: string;
  event_category: string;
  event_start_time: string;
  event_timezone: string;
  event_location: string;
  description: string;
  event_end_time: string;
  cost: number;
  total_number_tickets: number;
  symbol: string;
  stakes: {
    [email: string]: number;
  };
}


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


interface StakeholderStakes {
  [stakeholderId: string]: number;
}

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


export async function POST(req: Request, res: NextResponse) {
  try {
    const requestBody = await req.json();
    const { proposal_id, Vote, user_id }: { proposal_id: string; Vote: boolean; user_id: string } = requestBody;
    console.log(`proposal recieved ${proposal_id}`)

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

    if (allStakeholdersVotedPositively) {

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


// export async function GET(req: Request, res: NextResponse) {
//   const requestBody = await req.json();
//     const { proposal_id }: { proposal_id: string; } = requestBody;
//     console.log(`proposal recieved ${proposal_id}`)

//     const proposal = await prisma.proposals.findUnique({
//       where: { id: proposal_id },
//     });
//     console.log(` prop id  recieved ${proposal_id}`)
//     console.log(` prop ${proposal}`)

//     return NextResponse.json({ proposal , proposal_id}, { status: 500 });

// }


