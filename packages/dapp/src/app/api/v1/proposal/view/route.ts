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
  const {  user_id}: {   user_id: string } = requestBody;

  if (!user_id){
    return NextResponse.json({ "message": "no user id sent"}, { status: 404 });
  }
  try {
    const stakeholders = await prisma.stakeholders.findMany({
        where: {
          user_id: user_id
        },
        select: {
          proposal_id: true  // Only select the proposal_id from the relation
        }
      });
    
      // Extract the proposal IDs into a flat array, filtering out any nulls
      const proposalIds = stakeholders.map(stakeholder => stakeholder.proposal_id).filter(id => id !== null);
     proposalIds;
     return NextResponse.json({proposalIds},{ status: 200 });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:"server error"},{ status: 500 });
    
  }
  



}