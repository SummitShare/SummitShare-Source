import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request, res: NextResponse) {
   const requestBody = await req.json();
   const {
      user_id,
      wallet_address,
   }: { user_id: string; wallet_address: string } = requestBody;

   try {
      if (!user_id || !wallet_address) {
         return NextResponse.json(
            { error: 'Missing user_id or wallet_address' },
            { status: 400 }
         );
      }

      // Optionally, add validation for user_id and wallet_address

      const newUserWallet = await prisma.user_wallets.create({
         data: {
            user_id: user_id,
            wallet_address: wallet_address,
         },
      });
      //console.log(newUserWallet)

      return NextResponse.json({ newUserWallet }, { status: 201 });
   } catch (error) {
      console.error('Error in POST request:', error);
      return NextResponse.json(
         { error: 'An error occurred while processing your request.' },
         { status: 500 }
      );
   }
}
