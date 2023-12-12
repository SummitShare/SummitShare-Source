import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
import { ISwapRouter__factory } from '@/utils/typechain-types';
const prisma = new PrismaClient();

interface IStakes {
    [stakeholder: string]: number;
  }
export async function POST(req: Request, res: NextResponse) {
    try {
        const requestBody = await req.json();
        const { proposal_id, Vote, user_id }: { proposal_id: string; Vote: boolean; user_id: string } = requestBody;

        const proposal = await prisma.proposals.findUnique({
            where: { id: proposal_id },
            include: { events: true }
        });

        if (!proposal || !proposal.events) {
            return NextResponse.json({ error: 'Proposal or event not found' }, { status: 404 });
        }

        const user = await prisma.users.findUnique({
            where: {
                id: user_id,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const vote = await prisma.votes.create({
            data: {
                proposal_id,
                user_id,
                decision: Vote,
            },
        });


        

        const event_id = proposal.event_id;

        if (!event_id) {
            return NextResponse.json({ message: "no event" }, { status: 200 });
        }


        const event_creator_id = proposal.events.user_id;


        // Fetch all votes for the proposal
        const allVotes = await prisma.votes.findMany({ where: { proposal_id: proposal_id } });

        // Check if the event creator voted positively
        const eventCreatorVotedPositively = allVotes.some(vote => vote.user_id === event_creator_id && vote.decision === true);

        // Fetch all stakeholders for the event
        const stakeholders = await prisma.stakeholders.findMany({ where: { event_id: event_id } });

        // Check if all stakeholders voted positively
        const allStakeholdersVotedPositively = stakeholders.every(stakeholder => 
        allVotes.some(vote => vote.user_id === stakeholder.user_id && vote.decision === true));
        
        if (allStakeholdersVotedPositively) {
            // Assuming proposal.content is JSON and maps directly to the event fields

                if (typeof proposal.content === 'string' && proposal.content !== null) {
                    const content = JSON.parse(proposal.content);
                
                   
                    if (content.stakes) {
                        try {
                            const stakeUpdates = Object.entries(content.stakes).map(async ([email, stakeValue]) => {
                                // Asserting stakeValue as string
                                const stake = parseInt(stakeValue as string);

                                const user = await prisma.users.findUnique({
                                    where: { email: email }
                                });
                        
                                if (!user) {
                                    throw new Error(`User not found for email: ${email}`);
                                }
                        
                                // Find the stakeholder ID for the user and event
                                const stakeholder = await prisma.stakeholders.findFirst({
                                    where: {
                                        user_id: user.id,
                                        event_id: event_id
                                    }
                                });
                        
                                if (!stakeholder) {
                                    throw new Error(`Stakeholder not found for user ID: ${user.id} and event ID: ${event_id}`);
                                }
                        
                                // Update the stakeholder's stake
                                return prisma.stakeholders.update({
                                    where: { stakeholder_id: stakeholder.stakeholder_id },
                                    data: { stake }
                                });
                            });
                        
                            // Perform all stakeholder updates
                            await Promise.all(stakeUpdates);

                            await prisma.events.update({
                                where: { id: event_id },
                                data: {
                                    event_type: content.event_type,
                                    event_name: content.event_name,
                                    event_category: content.event_category,
                                    event_start_time: new Date(content.event_start_time),
                                    event_timezone: content.event_timezone,
                                    event_location: content.event_location,
                                    description: content.description,
                                    event_end_time: new Date(content.event_end_time),
                                    cost: parseFloat(content.cost),
                                    total_number_tickets: parseInt(content.total_number_tickets)
                                }
                            });
                        
                            // Step 1: Retrieve stakeholders for the given event
                            const stakeholders = await prisma.stakeholders.findMany({
                                where: { event_id: event_id },
                                include: {
                                    users: true // Include user information to access user_id
                                }
                            });

                            // Step 2 & 3: For each stakeholder, find and update wallet address
                            for (const stakeholder of stakeholders) {
                                if (stakeholder.user_id) {
                                    // Find the wallet address for the user
                                    const userId :string = stakeholder.user_id;
                                    const userWallet = await prisma.user_wallets.findFirst({
                                        where: { user_id:  userId }
                                    });

                                    if (userWallet && userWallet.wallet_address) {
                                        // Update the stakeholder's wallet_address field
                                        await prisma.stakeholders.update({
                                            where: { stakeholder_id: stakeholder.stakeholder_id },
                                            data: { wallet_address: userWallet.wallet_address }
                                        });
                                    }
                                }
                            }
                        
                            // Return a successful response
                            return NextResponse.json({ message: "Stakeholders updated successfully" }, { status: 200 });
                        
                        } catch (error) {
                            console.error('Error updating stakeholders:', error);
                        
                            // Return an error response
                            return NextResponse.json({ error: 'An error occurred while updating stakeholders.' }, { status: 500 });
                        }
                        
                    }
                }
            
         
            return NextResponse.json({ message: "Proposal accepted and event updated" ,proposal, Vote, user, vote }, { status: 200 });
        } else {
            // return NextResponse.json({ message: "Not all parties have voted positively" }, { status: 200 });
            return NextResponse.json({ proposal, Vote, user, vote }, { status: 200 });
        }
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}

        

