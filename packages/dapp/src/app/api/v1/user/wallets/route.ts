/*
Category: API Layer
Purpose: sends user wallets for a given user 
*/

import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/db';

/**
 * POST handler for sending getting user emails.
 *
 * Accepts a user_id from the request body and returns an array of user wallets objects.
 * This route can be extended to support various email types and templates.
 *
 * @param request - The incoming HTTP POST request containing the email subject and receiver.
 * @param wallet - user wallet object
 * @returns A JSON response indicating the success or failure of the email sending operation.
 */

export async function POST(request: Request, response: NextResponse) {
   try {
      const { user_id } = await request.json();

      if (!user_id) {
         return NextResponse.json(
            { message: 'no user id sent' },
            { status: 401 }
         );
      }

      //console.log(user_id)

      const wallets = await prisma.user_wallets.findMany({
         where: { user_id: user_id },
      });

      if (wallets.length < 1) {
         return NextResponse.json(
            { message: 'no wallets found d0ffa426-41e5-49ed-b9e0-653a8c55d036' },
            { status: 404 }
         );
      }
      //console.log(wallets)

      return NextResponse.json(
         { message: 'wallets found', wallets: wallets },
         { status: 200 }
      );
   } catch (error) {
      //console.log(error)
      return NextResponse.json(
         { message: 'internal server error' },
         { status: 500 }
      );
   }
}
