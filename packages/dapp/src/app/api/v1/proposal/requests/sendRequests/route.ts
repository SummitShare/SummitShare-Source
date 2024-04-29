/*
Category: Stakeholder Notification System
Purpose: Automates the process of sending email requests to potential stakeholders for proposal participation.
         It generates a unique verification token for each email, constructs a verification link, and tracks
         the success or failure of each email sent. This route is integral to engaging stakeholders in the
         decision-making process by ensuring they are notified and have the means to participate.
*/

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { emailServer, transporter } from '../../../../../../../config/nodemailer';
import { EmailStatus, EmailArray } from '@/utils/dev/typeInit';

const prisma = new PrismaClient();

/**
 * Processes and sends an email to a given address, creates a request record if successful.
 * 
 * @param email - The email address of the recipient.
 * @param proposal_id - The unique identifier of the proposal related to the email request.
 * @param host - The host from which the email is sent, used to construct the verification link.
 * @returns An object containing the status of the email process.
 */

async function handleEmailProcessing(email: string, proposal_id: string, host: string): Promise<EmailStatus> {
    // Check if the email is associated with a user
    const user = await prisma.users.findUnique({ where: { email } });
    const emailExists = !!user;

    const t = crypto.randomUUID();
    const verificationLink = `http://${host}/verifcation/request/${t}`;

    // Configure the mail options
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
        sendStatus = 1; // Indicate email sent successfully

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

/**
 * POST handler for sending emails to potential stakeholders of a proposal.
 * Iterates through an array of email addresses, sending each an email with a verification link.
 * 
 * @param req - The incoming HTTP POST request containing the array of emails and the proposal ID.
 * @returns A Next.js response object with the status of email sending for each address.
 */

export async function POST(req: Request, res: NextResponse) {
  const requestBody = await req.json();
  const { emailsArray, proposal_id}: { emailsArray: EmailArray, proposal_id: string } = requestBody;

  const host = req.headers.get('Host');
  const emailStatuses: Record<string, EmailStatus> = {};

  // Process each email in the provided array
  for (const email of emailsArray) {
      const result = await handleEmailProcessing(email, proposal_id, host!);
      emailStatuses[email] = result;
  }
  // Return the status for each email processed
  return NextResponse.json(emailStatuses, { status: 200 });
}