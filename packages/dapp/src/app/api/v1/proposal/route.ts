import { PrismaClient, } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '../../../../../config/db'

// const prisma = new PrismaClient()

interface IPropsal {
    event_type: string; // assuming event_type_enum is a string enum
    event_name?: string;
    event_category?: string; // assuming event_category_enum is a string enum
    event_start_time?: Date;
    symbol?: string;
    event_timezone?: string;
    event_location?: string;
    description?: string;
    contract_address?: string;
    event_end_time?: Date;
    cost?: number; // Decimal type in Prisma translates to number in TypeScript
    total_number_tickets?: number;
    // Additional properties for relations can be added if needed
  }

  interface EmailArray extends Array<string> {}


interface EmailStatus {
    exists: boolean;
    sent: boolean;
    status: number;
  }



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

  async function createProposal(url:string, proposal:IPropsal, user_id:string, )   {
    
    const data = {
      proposal,
      user_id,
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
    }: {
        user_id: string;

        proposal:IPropsal;
        emailsArray: EmailArray;
    } = requestBody        

 
    // Validate that numericCost is a number and not NaN
 
    const {
      event_name,
    } = proposal;
   


    
    
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
