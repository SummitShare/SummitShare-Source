import { IPropsal, EmailArray } from '@/utils/dev/typeInit';
import { PrismaClient, } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../../../config/db';
import { randomUUID } from 'node:crypto';





export async function POST(req: Request , res : NextResponse) {


    try {

        const {wallet_address , event_id, user_id }  = await req.json()

        if(!wallet_address){
            return NextResponse.json({ message: "no wallet address sent", }, { status: 400 });
        }
        if(!event_id){
            return NextResponse.json({ message: "no event id sent", }, { status: 400 });
        }
        if(!user_id){
            return NextResponse.json({ message: "no event id sent", }, { status: 400 });
        }

        const ticket = await prisma.tickets.create({
            data:{
                wallet_address: wallet_address,
                event_id: event_id,
                user_id:user_id
            }
        })
        if(!ticket){
            return NextResponse.json({ message: "failed to create ticket", }, { status: 400 });
        }

        const event = await prisma.events.findUnique({
            where:{
                id: event_id
            }
        })
        if(!event){
            return NextResponse.json({ message: "no event found", }, { status: 400 });
        }


        const price = event.cost!

        if(!user_id){
            return NextResponse.json({ message: "no user di id sent", }, { status: 400 });
        }

        const id = randomUUID()
        
        const ticketTransaction = await prisma.ticket_transaction.create({
            data:{
                id,
                event_id,
                user_id,
                price
            }
        })

        if(!ticketTransaction){
            return NextResponse.json({ message: "transaxtion not recorded", }, { status: 500 });
        }

        return NextResponse.json({ message: "ticket created", }, { status: 200 });


    
    } catch (error) {
        return NextResponse.json({ message: error, }, { status: 500 });
    }
  
}
