import { NextResponse } from 'next/server';
import prisma, { PRISMA_DISABLED } from '../../../../../../../config/db';
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

export async function POST(req: Request) {
   if (PRISMA_DISABLED) {
      return NextResponse.json(
         { message: 'Database temporarily disabled.' },
         { status: 503 }
      );
   }

   try {
      const host = req.headers.get('host');
      const url = new URL(req.url!, `http://${host}`);
      const queryParams = new URLSearchParams(url.search);
      const token = queryParams.get('token');
      const body = await req.json();
      const { password } = body;

      if (!token) {
         return NextResponse.json({ message: 'no token sent' }, { status: 401 });
      }
      const foundToken = await prisma.password_reset_tokens.findFirst({
         where: { id: token },
      });

      const user_id = foundToken?.user_id;

      if (!user_id) {
         return NextResponse.json(
            { message: 'no user_id found' },
            { status: 401 }
         );
      }

      if (!password) {
         return NextResponse.json(
            { message: 'please send password' },
            { status: 400 }
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

      if (!user) {
         return NextResponse.json(
            { message: 'no token,user_id or password sent' },
            { status: 401 }
         );
      }

      const isSamePassword = await bcrypt.compare(password, user.password);

      if (isSamePassword) {
         return NextResponse.json(
            { message: 'New password cannot be the same as the last password' },
            { status: 409 }
         );
      }
      const updateResponse = await prisma.users.update({
         where: {
            id: user_id,
         },
         data: {
            password: hashedPassword,
         },
      });

      return NextResponse.json({ message: 'user updated' }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'server error' }, { status: 500 });
   }
}
