import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import prisma from '../../../../../../config/db';
import { emailServer, transporter } from '../../../../../../config/nodemailer';

export async function POST(req: Request, res: NextResponse) {
   try {
      const { username } = await req.json();
      const existingUsername = await prisma.users.findUnique({
         where: { username },
      });
      if (existingUsername) {
         return NextResponse.json(
            { message: 'Username  unavailable already exists' },
            { status: 409 }
         );
      }

      return NextResponse.json(
         { message: 'Username available' },
         { status: 200 }
      );
   } catch (error) {
      console.error(error);
      return NextResponse.json({ failure: error }, { status: 500 });
   }
}
