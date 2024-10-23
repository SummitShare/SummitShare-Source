/*
Category: API Layer
Purpose: Delete a specified wallet address for a user and re-index the remaining wallet addresses to maintain sequential order.
*/

/**
 * Handles POST requests to delete a user's wallet address and re-index remaining addresses.
 *
 * This function accepts a user_id and wallet_address from the request body. It performs several checks:
 * - Ensures that a user_id is provided, returning a 401 error if not.
 * - Queries the database for existing wallets associated with the user_id, returning a 404 error if none are found.
 * - Identifies the wallet to be deleted by wallet_address, returning a 404 error if it's not found.
 * After removing the specified wallet address, it updates the indexes of remaining wallets to maintain a correct sequence.
 * This operation is performed as a database transaction to ensure data integrity.
 *
 * @param request - The incoming HTTP POST request containing the user_id and wallet_address to be deleted.
 * @param response - The NextResponse object for sending back HTTP responses.
 * @returns A NextResponse object with a JSON payload. On successful deletion, it returns a confirmation message.
 * On failure, it returns an error message with the corresponding HTTP status code.
 */

import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';

export async function POST(request: Request, response: NextResponse) {
   try {
      // Extracting user_id and wallet_address from the request body.
      const { user_id, wallet_address } = await request.json();

      if (!user_id) {
         return NextResponse.json(
            { message: 'no user id sent' },
            { status: 401 }
         );
      }

      const wallets = await prisma.user_wallets.findMany({
         where: { user_id: user_id },
         orderBy: { index: 'desc' },
      });

      if (wallets.length === 0) {
         return NextResponse.json(
            { message: 'no wallets found' },
            { status: 404 }
         );
      }

      const walletIndexToRemove = wallets.findIndex(
         (wallet) => wallet.wallet_address === wallet_address
      );
      if (walletIndexToRemove === -1) {
         return NextResponse.json(
            { message: 'Wallet not found' },
            { status: 404 }
         );
      }

      const removedWalletIndex = wallets[walletIndexToRemove].index;
      wallets.splice(walletIndexToRemove, 1); // Remove the wallet from the array

      if (wallets.length < 1) {
         await prisma.user_wallets.delete({
            where: {
               user_id: user_id,
               wallet_address: wallet_address,
            },
         });
         return NextResponse.json(
            { message: 'wallet deleted 1' },
            { status: 200 }
         );
      }

      // Update indexes of subsequent wallets
      wallets.forEach((wallet, index) => {
         if (wallet.index !== null && index < walletIndexToRemove) {
            wallet.index -= 1;
         }
      });

      await prisma.$transaction(async (prisma) => {
         // Step 1: Delete the wallet with the given address
         await prisma.user_wallets.deleteMany({
            where: {
               user_id: user_id,
               wallet_address: wallet_address,
            },
         });

         // Step 2: Update the indexes of the remaining wallets in the database
         for (const wallet of wallets) {
            await prisma.user_wallets.update({
               where: {
                  id: wallet.id,
               },
               data: {
                  index: wallet.index,
               },
            });
         }
      });

      // Return a 200 response with the newly created wallet data.
      return NextResponse.json({ message: 'wallet deleted' }, { status: 200 });
   } catch (error) {
      // In case of any errors during the process, return a 500 response indicating an internal server error.
      return NextResponse.json({ message: 'internal' }, { status: 500 });
   }
}
