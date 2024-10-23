/*
Category: API Layer
Purpose: Handles sending out emails for various purposes including verification, newsletters, and other communications within the dApp.
*/

import { NextResponse } from 'next/server';
import { transporter, emailServer } from '../../../../config/nodemailer';

/**
 * POST handler for sending emails.
 *
 * Accepts a subject and receiver from the request body and sends an email using predefined server configurations.
 * This route can be extended to support various email types and templates.
 *
 * @param request - The incoming HTTP POST request containing the email subject and receiver.
 * @returns A JSON response indicating the success or failure of the email sending operation.
 */

export async function POST(request: Request, response: NextResponse) {
   const { subject, receiver } = await request.json();
   try {
      // Define default mail options
      const mailOptions = {
         from: emailServer, // Sender address from server config
         to: receiver, // Recipient address from request
      };
      // Attempt to send the email
      await transporter.sendMail({
         ...mailOptions,
         subject: subject, // Subject line from request
         text: 'testing', // Placeholder text content
         html: '<h1>Test title<h1/>', // Placeholder HTML content
      });
      // Return a success response
      return NextResponse.json({ yes: 'great success' }, { status: 200 });
   } catch (error) {
      // Return a failure response
      return NextResponse.json({ no: 'you are a failure' }, { status: 200 });
   }
}
