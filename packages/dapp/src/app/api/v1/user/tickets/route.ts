import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/db';

export async function GET(req: Request, res: NextResponse) {
   try {
      const host = req.headers.get('host');
      const url = new URL(req.url!, `http://${host}`);
      const queryParams = new URLSearchParams(url.search);
      const user_id = queryParams.get('userId');

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

      return NextResponse.json({ tickets: tickets }, { status: 200 });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ failure: error }, { status: 500 });
   }
}
