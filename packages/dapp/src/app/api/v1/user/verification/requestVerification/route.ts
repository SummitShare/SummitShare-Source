import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';
import { users } from '@prisma/client';
import {
  emailServer,
  transporter,
} from '../../../../../../../config/nodemailer';

async function createSendTokens(user_id: string, email: string) {
  try {
    // Create verification token and expiry time
    const token = crypto.randomUUID(); // Generate a token
    const now = new Date();
    const expires = new Date(now.getTime() + 60 * 60 * 1000); // adds 1 hour to the current time

    const nowISO = now.toISOString();
    const expiresISO = expires.toISOString();

    // Store verification data in UserVerification table
    const id = crypto.randomUUID();

    const verification = await prisma.email_verification.create({
      data: {
        id: id,
        user_id: user_id,
        token: token,
        created_at: nowISO,
        expires: expiresISO,
      },
    });

    const host = process.env.HOST;
    const verificationLink = `${host}/verifcation/email/${token}`;

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

export async function GET(req: Request, res: NextResponse) {
  try {
    const host = req.headers.get('host');
    const url = new URL(req.url!, `http://${host}`);
    const queryParams = new URLSearchParams(url.search);
    const token = queryParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'no token sent' }, { status: 401 });
    }
    //console.log(`NT ${token}`)
    const verificationRecord = await prisma.email_verification.findFirst({
      where: { token: token },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { message: 'previous verification does not exist,create user account' },
        { status: 400 }
      );
    }
    //delete old verification
    await prisma.email_verification.delete({
      where: { id: verificationRecord.id! },
    });

    const user = await prisma.users.findUnique({
      where: { id: verificationRecord.user_id! },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'user does not exist' },
        { status: 401 }
      );
    }
    //create new verification
    const verification = await createSendTokens(
      verificationRecord.user_id!,
      user?.email!
    );

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
