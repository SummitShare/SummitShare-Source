import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import prisma from '../../../../../../../config/db';

export async function POST(req: Request, res: NextResponse) {
   try {
      const { user_id, event_id } = await req.json();

      if (!event_id) {
         return NextResponse.json(
            { message: 'no event id sent' },
            { status: 400 }
         );
      }
      if (!user_id) {
         return NextResponse.json(
            { message: 'no user id sent' },
            { status: 400 }
         );
      }

      const ticket = await prisma.tickets.findFirst({
         where: {
            user_id,
            event_id,
         },
      });

      if (!ticket) {
         return NextResponse.json({ allowed: 'false' }, { status: 401 });
      }

      return NextResponse.json({ allowed: 'true' }, { status: 200 });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ failure: error }, { status: 500 });
   }
}
