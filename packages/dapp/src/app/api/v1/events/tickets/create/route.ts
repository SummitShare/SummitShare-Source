import { IPropsal, EmailArray } from '@/utils/dev/typeInit';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';
import { randomUUID } from 'node:crypto';
import { sendEmail } from '@/utils/methods/email/email';
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
    const { wallet_address, event_id, user_id, eventLink } = await req.json();

    if (!wallet_address) {
      return NextResponse.json(
        { message: 'no wallet address sent' },
        { status: 400 }
      );
    }
    if (!event_id) {
      return NextResponse.json(
        { message: 'no event id sent' },
        { status: 400 }
      );
    }
    if (!user_id) {
      return NextResponse.json(
        { message: 'no user id sent or email' },
        { status: 400 }
      );
    }

    const ticket = await prisma.tickets.create({
      data: {
        wallet_address: wallet_address,
        event_id: event_id,
        user_id: user_id,
      },
    });
    if (!ticket) {
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

    if (!user) {
      return NextResponse.json({ message: 'no user created' }, { status: 400 });
    }
    const email = user.email;

    const event = await prisma.events.findUnique({
      where: {
        id: event_id,
      },
    });
    if (!event) {
      return NextResponse.json({ message: 'no event found' }, { status: 400 });
    }

    const price = event.cost!;

    if (!user_id) {
      return NextResponse.json({ message: 'no user id sent' }, { status: 400 });
    }

    const id = randomUUID();

    const ticketTransaction = await prisma.ticket_transaction.create({
      data: {
        id,
        event_id,
        user_id,
        price,
      },
    });

    if (!ticketTransaction) {
      return NextResponse.json(
        { message: 'transaction not recorded' },
        { status: 500 }
      );
    }

    const MailSent = await sendEmail(
      email,
      'ticket purchased',
      `follow this link to view the event ${eventLink}`
    );

    if (!MailSent) {
      return NextResponse.json(
        { message: 'failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'ticket created' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
