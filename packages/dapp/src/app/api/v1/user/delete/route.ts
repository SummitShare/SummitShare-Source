import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/db';
import { emailServer, transporter } from '../../../../../../config/nodemailer';
import * as fs from 'fs/promises';
import * as path from 'path';

async function sendDeletionConfirmationEmail(email: string, token: string) {
   try {
      // Read HTML template
      async function readHtmlTemplate(filePath: string): Promise<string> {
         try {
            const htmlContent = await fs.readFile(filePath, 'utf-8');
            return htmlContent;
         } catch (error) {
            console.error('Error reading HTML template:', error);
            throw new Error('Error reading HTML template');
         }
      }

      const filePath = path.join(
         process.cwd(),
         'src/features/emailNewsletter/main.html'
      );

      // Read the file

      console.log(`dir ${process.cwd()}`);
      console.log(`dir ${filePath}`);
      let htmlTemplate = await readHtmlTemplate(filePath);

      // Replace template placeholders
      htmlTemplate = htmlTemplate.replace(
         '{{title}}',
         'Account Deletion Confirmation'
      );
      htmlTemplate = htmlTemplate.replace('{{subtitle}}', 'Account Deletion');

      const host = process.env.HOST;
      const verificationLink = `${host}/account/delete-account/${token}`;
      htmlTemplate = htmlTemplate.replace(
         '{{message}}',
         `
            <p>We're sorry to see you go. Your account and all associated data will be deleted once you confirm</p>
            <p> <a href="${verificationLink}">${verificationLink}</a> </p>
            <p>If you didn't request this deletion, please contact our support team immediately.</p>
            <p>Thank you for being a part of our community.</p>
            `
      );

      const mailOptions = {
         from: emailServer,
         to: email,
         subject: 'Account Deletion Confirmation',
         html: htmlTemplate,
      };

      await transporter.sendMail(mailOptions);
   } catch (error) {
      console.error('Error sending deletion confirmation email:', error);
      throw error;
   }
}

export async function DELETE(req: Request) {
   try {
      const body = await req.json();
      const { userId, email } = body;

      if (!userId || !email) {
         return NextResponse.json(
            { message: 'User ID and email are required' },
            { status: 400 }
         );
      }

      console.log(`user id ${userId}
         ----`);

      const token = crypto.randomUUID(); // Generate a token
      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 60 * 1000); // adds 1 hour to the current time

      const nowISO = now.toISOString();
      const expiresISO = expires.toISOString();
      const id = crypto.randomUUID();

      const ev = await prisma.email_verification.create({
         data: {
            id: id,
            user_id: userId,
            token: token,
            created_at: nowISO,
            expires: expiresISO,
         },
      });

      // Send confirmation email
      await sendDeletionConfirmationEmail(email, ev.token);

      return NextResponse.json(
         { message: 'account successfully deleted from db' },
         { status: 200 }
      );
   } catch (error) {
      console.error(`delete account error: ${error}`);
      return NextResponse.json(
         { message: 'Failed to delete account' },
         { status: 500 }
      );
   }
}
