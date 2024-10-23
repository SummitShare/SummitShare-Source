import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import prisma from '../../../../../../../config/db';

export async function POST(req: Request, res: NextResponse) {
   try {
      const { username, user_id } = await req.json();
      const existingUsername = await prisma.users.findUnique({
         where: { username },
      });

      const user = await prisma.users.findFirst({
         where: {
            id: user_id,
         },
      });
      if (existingUsername) {
         return NextResponse.json(
            { message: 'Username  unavailable already exists' },
            { status: 409 }
         );
      }

      if (user) {
         const user = await prisma.users.update({
            where: { id: user_id },
            data: {
               username: username,
            },
         });
         return NextResponse.json(
            { message: 'Username updated', username: user.username },
            { status: 200 }
         );
      }

      return NextResponse.json({ message: 'user not found' }, { status: 404 });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ failure: error }, { status: 500 });
   }
}
