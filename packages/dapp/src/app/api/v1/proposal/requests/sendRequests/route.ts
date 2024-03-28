import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { emailServer, transporter } from '../../../../../../../config/nodemailer';

const prisma = new PrismaClient();

interface EmailStatus {
    exists: boolean;
    sent: boolean;
    status: number;
}

interface EmailArray extends Array<string> {}

async function handleEmailProcessing(email: string, proposal_id: string, host: string): Promise<EmailStatus> {
    // Check if the email is associated with a user
    const user = await prisma.users.findUnique({ where: { email } });
    const emailExists = !!user;

    const t = crypto.randomUUID();
    const verificationLink = `http://${host}/api/v1/proposal/requests/acceptRequests?token=${t}`;
    const mailOptions = {
        from: emailServer,
        to: email,
        subject: 'Your Subject Here',
        text: verificationLink,
    };

    let emailSent = false;
    let sendStatus = 0; // Default to failure status

    // Attempt to send the email and record the result
    try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
        sendStatus = 1; // Email sent successfully

        // Create a request only if the email was sent successfully
        await prisma.requests.create({
            data: {
                proposal_id: proposal_id, 
                email_address: email,
                token: t
                // status will be "Pending" by default as defined in the schema
            },
        });
    } catch (error) {
        console.error('Email send error:', error);
        emailSent = false;
        sendStatus = 0; // Email failed to send
    }

  return { exists: emailExists, sent: emailSent, status: sendStatus };
}

export async function POST(req: Request, res: NextResponse) {
  const requestBody = await req.json();
  const { emailsArray, proposal_id}: { emailsArray: EmailArray, proposal_id: string } = requestBody;

  const host = req.headers.get('Host');
  const emailStatuses: Record<string, EmailStatus> = {};

  for (const email of emailsArray) {
      const result = await handleEmailProcessing(email, proposal_id, host!);
      emailStatuses[email] = result;
  }

  return NextResponse.json(emailStatuses, { status: 200 });
}