import { Transporter } from 'nodemailer';
import { transporter, emailServer } from '../../../../config/nodemailer';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Sends an email with the specified content.
 * @param email The email address to send to.
 * @param subject The subject of the email.
 * @param body The HTML body of the email.
 * @param transporter The NodeMailer Transporter instance.
 * @returns A promise that resolves to true if the email was sent successfully, or throws an error if not.
 */

export async function sendEmail(
   email: string,
   subject: string,
   body: string
): Promise<boolean> {
   async function readHtmlTemplate(filePath: string): Promise<string> {
      try {
         const htmlContent = await fs.readFile(filePath, 'utf-8');
         return htmlContent;
      } catch (error) {
         throw new Error('Error reading HTML template');
      }
   }

   const templatePath = path.join(
      process.cwd(),
      'src/functionality/emailNewsletter/main.html'
   );
   let htmlTemplate = await readHtmlTemplate(templatePath);

   htmlTemplate = htmlTemplate.replace(
      '{{title}}',
      'SummitShare Exhibition Ticket'
   );
   htmlTemplate = htmlTemplate.replace('{{subtitle}}', 'See your ticket here');

   const mailOptions = {
      from: emailServer,
      to: email,
      subject: subject,
      html: htmlTemplate,
   };

   try {
      await transporter.sendMail(mailOptions);
      ////console.log('Email sent successfully');
      return true;
   } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
   }
}
