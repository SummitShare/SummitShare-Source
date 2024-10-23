import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '../../../../../config/db';

export async function POST(req: Request, res: NextResponse) {
   const requestBody = await req.json();
   const { user_id }: { user_id: string } = requestBody;

   try {
      if (!user_id) {
         return NextResponse.json({ error: 'missing user_id' }, { status: 400 });
      }

      const userWallets = await prisma.user_wallets.findMany({
         where: {
            user_id: user_id,
         },
      });

      if (userWallets.length === 0) {
         return NextResponse.json(
            { message: 'No wallets found for the given user_id.' },
            { status: 404 }
         );
      }

      return NextResponse.json({ userWallets }, { status: 200 });
   } catch (error) {
      console.error('Error in POST request:', error);
      return NextResponse.json(
         { error: 'An error occurred while processing your request.' },
         { status: 500 }
      );
   }
}
