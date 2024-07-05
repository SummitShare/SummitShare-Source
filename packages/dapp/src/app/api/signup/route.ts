import { NextResponse } from 'next/server';
import { transporter, emailServer } from '../../../../config/nodemailer';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

export async function POST(req: Request, res: NextResponse) {
  try {
    const { data } = await req.json();
    const { email, password } = await data;
    // //console.log("email", email)
    // //console.log("password", password)

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { failure: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

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
        user_id: user.id,
        token: token,
        created_at: nowISO,
        expires: expiresISO,
      },
    });

    // const host = req.headers.get('host');
    const host = process.env.HOST;
    const verificationLink = `${host}api/verifyEmail?token=${token}`;

    const mailOptions = {
      from: emailServer,
      to: email,
      subject: 'Email Verification',
      text: `Click on this link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: 'User created and email sent' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ failure: error }, { status: 500 });
  }
}
