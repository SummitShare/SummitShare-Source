import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';
import { users } from '@prisma/client';
import {
  emailServer,
  transporter,
} from '../../../../../../../config/nodemailer';

async function createSendTokens(user_id: string, email: string) {
  try {
    const now = new Date();
    const expires = new Date(now.getTime() + 60 * 60 * 1000); // adds 1 hour to the current time

    const nowISO = now.toISOString();

    const verification = await prisma.password_reset_tokens.create({
      data: {
        user_id: user_id,
        created_at: nowISO,
      },
    });

    const host = process.env.HOST;
    const verificationLink = `${host}/verifcation/email/${verification.id}`;
    const apiLink = `${host}/api/v1/user/password/verifytoken?token=${verification.id}`;

    const mailOptions = {
      from: emailServer,
      to: email,
      subject: 'Email Verification',
      text: `Click on this link to verify your account: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
    return verification;
  } catch (error) {
    throw error;
  }
}

export async function POST(req: Request, res: NextResponse) {
  try {
    const host = req.headers.get('host');
    const body = await req.json();
    const { user_id } = body;
    if (!user_id) {
      return NextResponse.json({ message: 'user  not sent' }, { status: 404 });
    }

    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'user does not exist' },
        { status: 401 }
      );
    }

    const verification = await createSendTokens(user.id, user?.email!);

    if (!verification) {
      return NextResponse.json(
        { message: 'failed to create verification link' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'verification link sent' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}
