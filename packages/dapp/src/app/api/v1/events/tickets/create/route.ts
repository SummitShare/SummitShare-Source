import { IPropsal, EmailArray } from '@/utils/dev/typeInit';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';
import { randomUUID } from 'node:crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  emailServer,
  transporter,
} from '../../../../../../../config/nodemailer';

/**
 * Helper function to read the HTML template for the email.
 */
async function readHtmlTemplate(filePath: string): Promise<string> {
  try {
    const htmlContent = await fs.readFile(filePath, 'utf-8');
    return htmlContent;
  } catch (error) {
    throw new Error('Error reading HTML template');
  }
}

/**
 * API Handler for creating tickets and recording ticket transactions.
 * This handler is responsible for creating a ticket entry in the database and a corresponding
 * ticket transaction record. It also sends a confirmation email to the user upon successful
 * creation of the ticket and transaction.
 *
 * @param {Request} req - The incoming request object, expected to contain wallet_address,
 *                        event_id, user_id, and eventLink in its JSON body.
 * @param {NextResponse} res - The outgoing response object used to send back responses to the client.
 * @returns {NextResponse} - Returns a JSON response with the status of the operation.
 */

export async function POST(req: Request, res: NextResponse) {
  try {
    console.log('Request received');
    const { wallet_address, event_id, user_id, eventLink, transaction_id } =
      await req.json();
    console.log('Request body:', {
      wallet_address,
      event_id,
      user_id,
      eventLink,
      transaction_id,
    });

    if (!wallet_address) {
      console.log('No wallet address sent');
      return NextResponse.json(
        { message: 'no wallet address sent' },
        { status: 400 }
      );
    }
    if (!event_id) {
      console.log('No event ID sent');
      return NextResponse.json(
        { message: 'no event id sent' },
        { status: 400 }
      );
    }
    if (!user_id) {
      console.log('No user ID sent');
      return NextResponse.json(
        { message: 'no user id sent or email' },
        { status: 400 }
      );
    }
    console.log(`event id${event_id}`);

    console.log(`user id${user_id}`);

    const ticket = await prisma.tickets.create({
      data: {
        wallet_address: wallet_address,
        event_id: event_id,
        user_id: user_id,
      },
    });
    console.log('Ticket created:', ticket);

    if (!ticket) {
      console.log('Failed to create ticket');
      return NextResponse.json(
        { message: 'failed to create ticket' },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });
    console.log('User found:', user);

    if (!user) {
      console.log('No user created');
      return NextResponse.json({ message: 'no user created' }, { status: 400 });
    }
    const email = user.email;

    const event = await prisma.events.findUnique({
      where: {
        id: event_id,
      },
    });
    console.log('Event found:', event);

    if (!event) {
      console.log('No event found');
      return NextResponse.json({ message: 'no event found' }, { status: 400 });
    }

    const price = event.cost!;
    console.log('Event price:', price);

    if (!user_id) {
      console.log('No user ID sent');
      return NextResponse.json({ message: 'no user id sent' }, { status: 400 });
    }

    const id = randomUUID();
    console.log('Generated transaction ID:', id);

    const ticketTransaction = await prisma.ticket_transaction.create({
      data: {
        id,
        event_id,
        user_id,
        price,
        wallet_address,
        transaction_id,
      },
    });
    console.log('Ticket transaction created:', ticketTransaction);

    if (!ticketTransaction) {
      console.log('Transaction not recorded');
      return NextResponse.json(
        { message: 'transaction not recorded' },
        { status: 500 }
      );
    }

    // Read the HTML template
    const templatePath = path.join(
      process.cwd(),
      'src/functonality/emailNewsletter/main.html'
    );
    let htmlTemplate = await readHtmlTemplate(templatePath);

    // Replace placeholders in the template with actual data
    const verificationLink = `${eventLink}`;
    htmlTemplate = htmlTemplate.replace(
      '{{title}}',
      'Ticket Purchase Confirmation'
    );
    htmlTemplate = htmlTemplate.replace(
      '{{subtitle}}',
      'Thank you for your purchase!'
    );
    htmlTemplate = htmlTemplate.replace(
      '{{message}}',
      `You can view the exhibit by following this link: <a href="${verificationLink}">${verificationLink}</a>.<br><br>Your purchase enables revenue distribution within our connected heritage community and creates lasting value for them through your engagement with this collection of tokenized artifacts. We are building a new cycle of value addition, directly benefiting the Gwembe Valley community in the Southern Province of Zambia. <br><br>View our <a href="https://summitshare.co/distribution">Distributions page</a> to keep track of our work with this exhibition.`
    );

    const mailOptions = {
      from: emailServer,
      to: email,
      subject: 'Congratulations on your ticket purchase!',
      html: htmlTemplate,
    };

    const MailSent = await transporter.sendMail(mailOptions);
    console.log('Email sent status:', MailSent);

    if (!MailSent) {
      console.log('Failed to send email');
      return NextResponse.json(
        { message: 'failed to send email' },
        { status: 500 }
      );
    }

    console.log('Ticket created successfully');
    return NextResponse.json({ message: 'ticket created' }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
