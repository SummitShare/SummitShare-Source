/*
Category: Stakeholder Notification System
Purpose: Automates the process of sending email requests to potential stakeholders for proposal participation.
         It generates a unique verification token for each email, constructs a verification link, and tracks
         the success or failure of each email sent. This route is integral to engaging stakeholders in the
         decision-making process by ensuring they are notified and have the means to participate.
*/

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { EmailStatus, EmailArray } from '@/utils/dev/typeInit';
import prisma from '../../../../../../config/db';

export async function POST(req: Request, res: NextResponse) {
  const requestBody = await req.json();
  const host = req.headers.get('host');
  const {  email_address}: {   email_address: string } = requestBody;

  if (!email_address){
    return NextResponse.json({ "message": "no user id sent"}, { status: 404 });
  }
  try {
    const requests = await prisma.requests.findMany({
        where: {
            email_address:email_address,
            status: "Pending"
        },
      });
    
      // Extract the proposal IDs into a flat array, filtering out any nulls
      const verificationLinks = requests.map(request => {
        return `http://${host}/verification/request/${request.token}`;
    });
     return NextResponse.json({verificationLinks},{ status: 200 });
    
  } catch (error) {
    //console.log(error)
    return NextResponse.json({message:"server error"},{ status: 500 });
    
  }
  



}