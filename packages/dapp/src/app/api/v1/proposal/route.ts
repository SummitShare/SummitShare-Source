/*
Category: Proposal Management
Purpose: Manages the lifecycle of a proposal from creation to notification. This route supports the submission of new proposals, 
         automatically sends out email requests to potential stakeholders for their participation, and ensures the proposal 
         submitter is added as a stakeholder. It's designed to streamline the process of proposal engagement within the governance 
         framework of the application.
*/

import { PrismaClient, } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../config/db'
import { IPropsal, EmailArray, EmailStatus } from '@/utils/dev/typeInit'

/**
 * Sends email requests to potential stakeholders using an external API.
 * 
 * @param url - The endpoint for the email sending service.
 * @param emailsArray - An array of email addresses to which the proposal requests will be sent.
 * @param proposal_id - The unique identifier of the proposal related to the email requests.
 * @returns The response from the email sending service.
 */
export async function POST(req: Request , res : NextResponse) {
  async function sendRequests(url:string , emailsArray : EmailArray, proposal_id :string ) {
    const data = {
      emailsArray,
      proposal_id
    };

    const response = await  fetch( url,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(data),
    })
    return response.json(); 
  }

  /**
 * Creates a proposal in the database and optionally sends requests to stakeholders.
 * 
 * @param url - The endpoint for the proposal creation service.
 * @param proposal - The proposal object containing details about the proposal.
 * @param user_id - The unique identifier of the user creating the proposal.
 * @returns The newly created proposal record.
 */
  async function createProposal(url : string, proposal : IPropsal, user_id : string, )   {
    const data = {
      proposal,
      user_id
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const prop = JSON.stringify(proposal)
    const newProposal = await prisma.proposals.create({
      data:{
        user_id: user_id,
        content: prop
      }
  })
    return newProposal;
  }

    const requestBody = await req.json();
    const {
      user_id,
      proposal,
      emailsArray
      // Add other fields from the proposal object here if necessary
    } : {
        user_id: string;
        proposal:IPropsal;
        emailsArray: EmailArray;
    } = requestBody        
 
    // Validate that numericCost is a number and not NaN
    const { event_name } = proposal;
    
      const host = process.env.HOST
      const url = `${host}api/v1/proposal/createProposal`;
      const prop = await createProposal(url, proposal,user_id,);
      const url2 = `${host}/api/v1/proposal/requests/sendRequests`
      const reqs = await sendRequests(url2,emailsArray,prop.id)

      const newStakeholder = await prisma.stakeholders.create({
        data: {
            user_id: user_id,
            proposal_id: prop.id,
        },
        });
        console.log(`newStakeholder = ${newStakeholder.stakeholder_id}`) 

        const newStakeholder_id = newStakeholder.stakeholder_id
      return NextResponse.json({ message: "success", prop,reqs,newStakeholder_id }, { status: 200 });
    }
