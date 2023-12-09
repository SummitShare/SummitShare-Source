import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

import  prisma from '../../../../../../config/db';
import { Console } from "console";

export async function  GET(req: Request , res : NextResponse) {
    //const { email, password}= await req.json()
    const host = req.headers.get('host');
    const url = new URL(req.url!, `http://${host}`);
    const queryParams = new URLSearchParams(url.search);
    const token = queryParams.get('token')!;
  
    if (token) {
      // Perform your email verification logic here
        console.log(`token = ${token}`)
      try {

        const request = await prisma.requests.findFirst({
          where: { token: token },
      });
  
      if (!request || !request.email_address || !request.event_id) {
          console.log(`Request or required fields missing for token: ${token}`);
          return NextResponse.json({ error: 'Request not found or incomplete' }, { status: 404 });
      }
  
      const email = request.email_address;
      const event_id = request.event_id;
      console.log(`info = ${event_id} ${email}`);
  
      // Find user using email
      const user = await prisma.users.findUnique({
          where: { email: email },
      });
      console.log(`user = ${user?.id}`);
      const user_id = user?.id;



      const updatedRequest = await prisma.requests.update({
        where: { token: token },
        data: { status: "Accepted" },
     });

     console.log(`updatedRequest = ${updatedRequest}`)

    // Create a new stakeholder record
    const newStakeholder = await prisma.stakeholders.create({
      data: {
          user_id: user_id,
          event_id: event_id,
      },
      });
      console.log(`newStakeholder = ${newStakeholder}`) 
 
        return NextResponse.json({ message: "Email verified successfully" },{status: 201});
      } catch (error) {
        console.log(`error = ${error}`)
        return NextResponse.json({ message: 'faliure', error : error}, { status: 400 })
      }
    } else {
      console.log("token error")
        return NextResponse.json({ message: 'faliure'}, { status: 400 })
        
    }
}
