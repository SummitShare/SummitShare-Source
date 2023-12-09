import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

import  prisma from '../../../../../config/db';

export async function  POST(req: Request , res : NextResponse) {
    //const { email, password}= await req.json()
    const requestBody = await req.json();
    const { event_id , user_id  }: { event_id: string , user_id:string } = requestBody;
    
     try {

        if (event_id == null || user_id == null) {    
            return NextResponse.json({ error: 'missing event_id or user_id' }, { status: 400 });
        }

        const stakeholders = await prisma.stakeholders.findMany({
            where: {
                event_id: event_id,
            },
        });
        return NextResponse.json({ stakeholders}, { status: 200 });   
        
     } catch (error) {
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });   
     }
}
