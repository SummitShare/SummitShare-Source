import { IPropsal, EmailArray } from '@/utils/dev/typeInit';
import { PrismaClient, } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../../../config/db';





export async function POST(req: Request , res : NextResponse) {


    try {

        const {wallet_address , event_id } = await req.json()

        if(!wallet_address){
            return NextResponse.json({ message: "no wallet address sent", }, { status: 400 });
        }
        if(!event_id){
            return NextResponse.json({ message: "no event id sent", }, { status: 400 });
        }

        const ticket = await prisma.tickets.create({
            data:{
                wallet_address: wallet_address,
                event_id: event_id,
            }
        })

        if(!ticket){
            return NextResponse.json({ message: "failed to create ticket", }, { status: 400 });
        }

        return NextResponse.json({ message: "ticket created", }, { status: 200 });


    
    } catch (error) {
        return NextResponse.json({ message: error, }, { status: 500 });
    }
  
}
