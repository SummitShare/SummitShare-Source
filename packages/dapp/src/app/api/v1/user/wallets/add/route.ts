import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../../../../config/db';
import { parseJson } from '@/lib/apiValidation';

const addWalletSchema = z.object({
   user_id: z.string().min(1),
   wallet_address: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
});

export async function POST(request: Request) {
   const validation = await parseJson(request, addWalletSchema);
   if (!validation.ok) return validation.response;

   const { user_id, wallet_address } = validation.data;

   try {
      const wallets = await prisma.user_wallets.findMany({
         where: { user_id },
         orderBy: { index: 'desc' },
      });

      if (wallets.some((w) => w.wallet_address === wallet_address)) {
         return NextResponse.json(
            { message: 'wallet already exists' },
            { status: 409 }
         );
      }

      const newIndex = wallets.length > 0 ? (wallets[0].index ?? 0) + 1 : 1;

      const newWallet = await prisma.user_wallets.create({
         data: { user_id, wallet_address, index: newIndex },
      });

      return NextResponse.json(
         { message: 'wallets found', wallet: newWallet },
         { status: 200 }
      );
   } catch (error) {
      console.error('Add wallet error:', error);
      return NextResponse.json(
         { message: 'internal server error' },
         { status: 500 }
      );
   }
}
