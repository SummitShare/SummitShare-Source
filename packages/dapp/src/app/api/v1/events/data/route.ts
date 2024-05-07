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

    const ticketTransactions = await prisma.ticket_transaction.count()

    const event = await prisma.events.findUnique({
      where: {
        id: event_id
      }
    })
  
    if (!event) {
      return NextResponse.json({ message: "no event found", }, { status: 400 });
    }

    const total = ticketTransactions * Number(event.cost)
  
    return NextResponse.json({ 
      total: total, 
      ticketsSold: ticketTransactions
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error, }, { status: 500 });
  }

}
