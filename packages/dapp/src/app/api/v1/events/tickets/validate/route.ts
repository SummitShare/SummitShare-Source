import { IPropsal, EmailArray } from '@/utils/dev/typeInit';
import { PrismaClient, } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../../../config/db';





export async function POST(req: Request , res : NextResponse) {


    try {

        const {wallet_addresss , event_id } = await req.json()

        if(!wallet_addresss){
            return NextResponse.json({ message: "no wallet address sent", }, { status: 400 });
        }
        if(!event_id){
            return NextResponse.json({ message: "no event id sent", }, { status: 400 });
        }

        const ticket = await prisma.tickets.findFirst({
            where:{
                wallet_address: wallet_addresss,
                event_id: event_id,
            }
        })

        if(!ticket){
            return NextResponse.json({ message: "no tickets found", }, { status: 400 });
        }

        const purchased_at = new Date(ticket.purchased_at!)

        const expiryDate = new Date(purchased_at.getTime()+(48*60*60*1000))


        if(new Date() > expiryDate){
            return NextResponse.json({ message: "ticket expired", }, { status: 401 });
        }

        return NextResponse.json({ message: "ticket validated", }, { status: 200 });


    
    } catch (error) {
        return NextResponse.json({ message: error, }, { status: 500 });
    }
  
}
