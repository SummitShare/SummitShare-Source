import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../../config/db';
import { emailServer, transporter } from '../../../../../config/nodemailer';
import { users } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

async function readHtmlTemplate(filePath: string): Promise<string> {
  try {
    const htmlContent = await fs.readFile(filePath, 'utf-8');
    return htmlContent;
  } catch (error) {
    throw new Error('Error reading HTML template');
  }
}

async function createSendTokens(user: users, email: string) {
  try {
    // Create verification token and expiry time
    const token = crypto.randomUUID(); // Generate a token
    const now = new Date();

    //
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

    // Read the HTML template
    const templatePath = path.join(
      process.cwd(),
      'src/functonality/emailNewsletter/main.html'
    );
    let htmlTemplate = await readHtmlTemplate(templatePath);

    // const host = req.headers.get('host');
    const host = process.env.HOST;
    //${host}api/v1/user/verification/verifyEmail?token=${token}
    const verificationLink = `${host}/verification/email/${token}`;

    // Replace placeholders in the template with actual data
    htmlTemplate = htmlTemplate.replace('{{title}}', 'Email Verification');
    htmlTemplate = htmlTemplate.replace('{{subtitle}}', 'Verify Your Account');
    htmlTemplate = htmlTemplate.replace(
      '{{message}}',
      `Click on this link to verify your account: <a href="${verificationLink}">${verificationLink}</a>`
    );

    const mailOptions = {
      from: emailServer,
      to: email,
      subject: 'Email Verification',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    return verification;
  } catch (error) {
    throw error;
  }
}

async function userWithUsername(
  email: string,
  hashedPassword: string,
  username: string
) {
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      username,
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
  const verificationLink = `${host}/api/verifyEmail?token=${token}`;

  const mailOptions = {
    from: emailServer,
    to: email,
    subject: 'Email Verification',
    text: `Click on this link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions);

  return user;
}

async function createExhibitor(
  email: string,
  hashedPassword: string,
  username: string,
  type: string,
  wallet_address: string
) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          username,
          type: type,
        },
      });

      const wallet = await prisma.user_wallets.create({
        data: {
          user_id: user.id,
          wallet_address: wallet_address,
          index: 1,
        },
      });

      return { user, wallet };
    });

    const { user, wallet } = result;
    const verification = await createSendTokens(user, email);

    return { user, wallet, verification };
  } catch (error) {
    console.error('Error creating exhibitor:', error);
    throw error;
  }
}

async function createVisitor(
  email: string,
  hashedPassword: string,
  username: string,
  type: string
) {
  try {
    if (!username) {
      username = randomUUID();
    }

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        type: type,
      },
    });

    const verification = await createSendTokens(user, email);

    return { user, verification };
  } catch (error) {
    console.error('Error creating visitor:', error);
    throw error;
  }
}

export async function POST(req: Request, res: NextResponse) {
  try {
    // if (!req.body || Object.keys(req.body).length === 0) {
    //   return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    // }
    const { email, password, username, type, wallet_address } =
      await req.json();
    // Check if user already exists

    const existingUserName = await prisma.users.findUnique({
      where: { username },
    });
    if (existingUserName) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 409 }
      );
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    if (!type) {
      return NextResponse.json({ message: 'no user type' }, { status: 400 });
    }

    switch (type) {
      case 'exhibitor':
        const exhibitor = await createExhibitor(
          email,
          hashedPassword,
          username,
          type,
          wallet_address
        );
        return NextResponse.json(
          { success: 'User created and email sent', user: exhibitor },
          { status: 201 }
        );
      case 'visitor':
        const visitor = await createVisitor(
          email,
          hashedPassword,
          username,
          type
        );
        return NextResponse.json(
          { success: 'User created and email sent', user: visitor },
          { status: 201 }
        );
      default:
        return NextResponse.json(
          { success: 'user type error' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ failure: error }, { status: 500 });
  }
}
