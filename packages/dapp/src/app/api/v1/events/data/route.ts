import { IPropsal, EmailArray } from '@/utils/dev/typeInit';
import { PrismaClient, } from '@prisma/client'
import { NextResponse } from 'next/server'

import { randomUUID } from 'node:crypto';
import prisma from '../../../../../../config/db';


export async function POST(req: Request, res: NextResponse) {

  try {
    const {  event_id, user_id } = await req.json()

   
    if (!event_id) {
      return NextResponse.json({ message: "no event id sent", }, { status: 400 });
    }
    if (!user_id) {
      return NextResponse.json({ message: "no user id sent", }, { status: 400 });
    }

    const ticketsSold = await prisma.ticket_transaction.findMany({
      where:{
        event_id:event_id
      }
    })

    const ticketTransactions = ticketsSold.length

    const event = await prisma.events.findUnique({
      where: {
        id: event_id
      }
    })
  
    if (!event) {
      return NextResponse.json({ message: "no event found", }, { status: 404 });
    }

    const stakeholders = await prisma.stakeholders.findMany({
      where:{
        event_id:event_id
      }
    })

    if (!stakeholders || stakeholders.length === 0) {
      return NextResponse.json({ message: "No stakeholders found" }, { status: 404 });
    }

    // Fetch user details for each stakeholder and calculate distribution
    const distributionData = await Promise.all(stakeholders.map(async (stakeholder) => {
      if (!stakeholder.user_id) {
        return null;
      }

      const user = await prisma.users.findUnique({
        where: { id: stakeholder.user_id },
        select: { id: true, username: true }
      });

      if (!user) {
        return null;
      }

      const sharePercentage = stakeholder.stake || 0;
      const totalAmount = ticketTransactions * Number(event.cost);
      const distributedAmount = (sharePercentage / 100) * totalAmount;

      return {
        user_id: user.id,
        username: user.username,
        sharePercentage: sharePercentage,
        distributedAmount: distributedAmount
      };
    }));


    const stekholderData = distributionData.filter(data => data !== null);
    const total = ticketTransactions * Number(event.cost)
  
    return NextResponse.json({ 
      total: total, 
      ticketsSold: ticketTransactions,
      stekholderData

    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error, }, { status: 500 });
  }

}
