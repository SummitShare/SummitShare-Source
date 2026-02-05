import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const user_id = searchParams.get('userId');

      if (!user_id) {
         return NextResponse.json(
            { message: 'no user id sent' },
            { status: 400 }
         );
      }

      const tickets = await prisma.tickets.findMany({
         where: {
            user_id,
         },
      });

      if (!tickets) {
         return NextResponse.json(
            { message: 'no tickets found' },
            { status: 404 }
         );
      }

      return NextResponse.json({ tickets }, { status: 200 });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ failure: error }, { status: 500 });
   }
}
