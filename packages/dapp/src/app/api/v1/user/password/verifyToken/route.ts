import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../../../../config/db';
import bcrypt from 'bcryptjs';
import { parseJson } from '@/lib/apiValidation';

const verifyTokenSchema = z.object({
   password: z.string().min(8).max(200),
});

const TOKEN_TTL_MINUTES = 30;

export async function POST(req: Request) {
   const url = new URL(req.url);
   const token = url.searchParams.get('token');

   if (!token) {
      return NextResponse.json({ message: 'no token sent' }, { status: 401 });
   }

   const validation = await parseJson(req, verifyTokenSchema);
   if (!validation.ok) return validation.response;

   const { password } = validation.data;

   try {
      const verificationRecord = await prisma.password_reset_tokens.findFirst({
         where: { id: token },
      });

      if (!verificationRecord || !verificationRecord.user_id) {
         return NextResponse.json(
            { message: 'Invalid or expired token' },
            { status: 401 }
         );
      }

      const tokenAgeMinutes =
         (Date.now() - new Date(verificationRecord.created_at!).getTime()) /
         (1000 * 60);

      if (tokenAgeMinutes > TOKEN_TTL_MINUTES) {
         await prisma.password_reset_tokens.delete({
            where: { id: verificationRecord.id },
         });
         return NextResponse.json({ message: 'Token expired.' }, { status: 401 });
      }

      const user = await prisma.users.findUnique({
         where: { id: verificationRecord.user_id },
      });

      if (!user) {
         return NextResponse.json(
            { message: 'Invalid or expired token' },
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

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.users.update({
         where: { id: user.id },
         data: { password: hashedPassword },
      });

      await prisma.password_reset_tokens.delete({
         where: { id: verificationRecord.id },
      });

      return NextResponse.json({ message: 'user updated' }, { status: 200 });
   } catch (error) {
      console.error('Password reset verify error:', error);
      return NextResponse.json({ message: 'server error' }, { status: 500 });
   }
}
