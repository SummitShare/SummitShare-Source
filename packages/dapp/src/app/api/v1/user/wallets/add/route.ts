/*
Category: API Layer
Purpose: creates a user wallet 
*/
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';

/**
 * POST handler for sending getting user emails.
 *
 *  This module exports an asynchronous function designed to handle POST requests within a Next.js API route.
 *The function adds a new wallet address for a user, ensuring the user doesn't exceed the limit of 3 wallet addresses.
 * It performs input validation, database querying, and conditional logic to manage wallet addresses associated with a user.
 */

export async function POST(request: Request, response: NextResponse) {
   try {
      // Extracting user_id and wallet_address from the request body.
      const { user_id, wallet_address } = await request.json();

      // Validate if the user_id is present in the request body.
      if (!user_id) {
         // If user_id is missing, return a 401 response with an error message.
         return NextResponse.json(
            { message: 'no user id sent' },
            { status: 401 }
         );
      }

      // Retrieve all wallet addresses associated with the user, ordered by their index in descending order.
      const wallets = await prisma.user_wallets.findMany({
         where: { user_id: user_id },
         orderBy: {
            index: 'desc', // This ensures the retrieval of the highest index first.
         },
      });

      // Check if the user has already added this wallet
      for (let index = 0; index < wallets.length; index++) {
         const wallet = wallets[index];
         if (wallet_address == wallet.wallet_address) {
            return NextResponse.json(
               { message: 'wallet already exists' },
               { status: 409 }
            );
         }
      }

      // Calculate the index for the new wallet. If wallets exist, increment the highest index by 1; otherwise, start at 1.
      const newIndex = wallets.length > 0 ? (wallets[0].index ?? 0) + 1 : 1;

      // Create a new wallet record in the database with the user_id, wallet_address, and calculated index.
      const newWallet = await prisma.user_wallets.create({
         data: {
            user_id: user_id,
            wallet_address: wallet_address,
            index: newIndex,
         },
      });

      // Return a 200 response with the newly created wallet data.
      return NextResponse.json(
         { message: 'wallets found', wallet: newWallet },
         { status: 200 }
      );
   } catch (error) {
      //console.log(error)
      // In case of any errors during the process, return a 500 response indicating an internal server error.
      return NextResponse.json(
         { message: 'internal server error' },
         { status: 500 }
      );
   }
}
