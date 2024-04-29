/*
Category: Stakeholder Engagement
Purpose: Facilitates the acceptance of stakeholder requests through a token-based verification process. This route is central to ensuring stakeholders who have been invited to participate in a proposal can verify their email addresses and formally accept the request to be involved. It strengthens the governance model by formalizing stakeholder involvement through a secure and verifiable process.
*/

import { NextResponse } from 'next/server';
import  prisma from '../../../../../../../config/db';

/**
 * Handles GET requests for accepting proposals based on a verification token.
 * It retrieves the request associated with the token, validates it, and updates the request's status.
 * Additionally, it creates a new stakeholder record linked to the proposal and the user.
 * 
 * @param req - The incoming HTTP GET request containing the verification token as a query parameter.
 * @returns A Next.js response object indicating the outcome of the operation.
 */

// export async function  GET(req: Request , res : NextResponse) {
//     // Extract the 'host' header to construct the full URL for parsing query parameters
//     const host = req.headers.get('host');
//     const url = new URL(req.url!, `http://${host}`);
//     const queryParams = new URLSearchParams(url.search);
//     const token = queryParams.get('token')!;
  
//     if (token){
//         console.log(`token = ${token}`)
//       try {
//         // Retrieve the request from the database using the provided token
//         const request = await prisma.requests.findFirst({
//           where: { token: token },
//       });

//       console.log(`req ${request} email ${request?.email_address} prop ${request?.proposal_id}`)
//       if (!request || !request.email_address || !request.proposal_id) {
//           console.log(`Request or required fields missing for token: ${token}`);
//           return NextResponse.json({ error: 'Request not found or incomplete' }, { status: 404 });
//       }
  
//       const email = request.email_address;
//       const proposal_id = request.proposal_id;
//       console.log(`info = ${proposal_id} ${email}`);
  
//       // Retrieve the user associated with the email address from the request
//       const user = await prisma.users.findUnique({
//           where: { email: email },
//       });
//       console.log(`user = ${user?.id}`);
//       const user_id = user?.id;

//       // Update the request's status to "Accepted" in the database
//       const updatedRequest = await prisma.requests.update({
//         where: { token: token },
//         data: { status: "Accepted" },
//      });

//      console.log(`updatedRequest = ${updatedRequest}`)

    
//     const newStakeholder = await prisma.stakeholders.create({
//       data: {
//           user_id: user_id,
//           proposal_id: proposal_id,
//       },
//       });
//       console.log(`newStakeholder = ${newStakeholder}`) 
 
//         return NextResponse.json({ message: "Email verified successfully" },{status: 201});
//       } catch (error) {
//         console.log(`error = ${error}`)
//         return NextResponse.json({ message: 'faliure', error : error}, { status: 400 })
//       }
//     } else {
//       console.log("token error")
//         return NextResponse.json({ message: 'faliure'}, { status: 400 })
        
//     }
// }

export async function  POST(req: Request , res : NextResponse) {
  // Extract the 'host' header to construct the full URL for parsing query parameters
  const host = req.headers.get('host');
  const url = new URL(req.url!, `http://${host}`);
  const queryParams = new URLSearchParams(url.search);

  const requestBody = await req.json();
  const  {token , response } = requestBody
  if (token){
      console.log(`token = ${token}`)
    try {
      // Retrieve the request from the database using the provided token
      const request = await prisma.requests.findFirst({
        where: { token: token },
    });

    console.log(`req ${request} email ${request?.email_address} prop ${request?.proposal_id}`)
    if (!request || !request.email_address || !request.proposal_id) {
        console.log(`Request or required fields missing for token: ${token}`);
        return NextResponse.json({ message: 'Request not found or incomplete' }, { status: 404 });
    }

    if (!response ) {
      console.log(`response missing for token: ${token}`);
      return NextResponse.json({ message: 'Request not found or incomplete' }, { status: 404 });
    }

    const email = request.email_address;
    const proposal_id = request.proposal_id;
    console.log(`info = ${proposal_id} ${email}`);

    // Retrieve the user associated with the email address from the request
    const user = await prisma.users.findUnique({
        where: { email: email },
    });
    console.log(`token user = ${user?.id}`);
    const user_id = user?.id;

    // Update the request's status to "Accepted" in the database
    const updatedRequest = await prisma.requests.update({
      where: { token: token },
      data: { status: response },
   });

   console.log(`updatedRequest = ${updatedRequest}`)

   if (response !== "Accepted") {
    return NextResponse.json({ message: "request rejected" },{status: 200});
   }
  const newStakeholder = await prisma.stakeholders.create({
    data: {
        user_id: user_id,
        proposal_id: proposal_id,
    },
    });
    console.log(`newStakeholder = ${newStakeholder}`) 

      return NextResponse.json({ message: "request accepted" },{status: 200});
    } catch (error) {
      console.log(`error = ${error}`)
      return NextResponse.json({ message: 'faliure', error : error}, { status: 400 })
    }
  } else {
    console.log("token error")
      return NextResponse.json({ message: 'faliure'}, { status: 400 })
      
  }
}
