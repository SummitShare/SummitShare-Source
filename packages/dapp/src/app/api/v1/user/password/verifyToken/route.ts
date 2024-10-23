import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';
import { users } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { emailServer, transporter } from '../../../../../../../config/nodemailer';

async function updateUser(
   user_id: string,
   hashedPassword: string
): Promise<boolean> {
   try {
      const updateResponse = await prisma.users.update({
         where: {
            id: user_id,
         },
         data: {
            password: hashedPassword,
         },
      });

      //console.log('Password updated successfully:', updateResponse.id);
      return true;
   } catch (error) {
      console.error('Failed to update user password:', error);
      return false;
   }
}

export async function POST(req: Request, res: NextResponse) {
   try {
      const host = req.headers.get('host');
      const url = new URL(req.url!, `http://${host}`);
      const body = await req.json();
      const { user_id, token, password } = body;

      if (!token || !user_id || !password) {
         return NextResponse.json(
            { message: 'no token,user_id or password sent' },
            { status: 401 }
         );
      }

      const verificationRecord = await prisma.password_reset_tokens.findFirst({
         where: { id: token },
      });

      if (!verificationRecord) {
         return NextResponse.json(
            {
               message:
                  'previous verification does not exist,create user account',
            },
            { status: 400 }
         );
      }

      const tokenAgeMinutes =
         (new Date().getTime() -
            new Date(verificationRecord.created_at!).getTime()) /
         (1000 * 60);

      if (tokenAgeMinutes > 30) {
         await prisma.password_reset_tokens.delete({
            where: { id: verificationRecord.id },
         });

         return NextResponse.json({ message: 'Token expired.' }, { status: 401 });
      }

      const user = await prisma.users.findUnique({
         where: { id: verificationRecord.user_id! },
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      const updateStatus = await updateUser(
         verificationRecord.user_id!,
         hashedPassword!
      );

      if (!updateStatus) {
         return NextResponse.json(
            { message: 'failed to update user try again' },
            { status: 500 }
         );
      }
      return NextResponse.json({ message: 'user updated' }, { status: 200 });
   } catch (error) {
      return NextResponse.json({ message: 'server error' }, { status: 500 });
   }
}
