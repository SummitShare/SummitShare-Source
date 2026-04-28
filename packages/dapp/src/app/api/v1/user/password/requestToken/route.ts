import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../../../../../config/db';
import { emailServer, transporter } from '../../../../../../../config/nodemailer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parseJson } from '@/lib/apiValidation';

const requestTokenSchema = z.object({
   email: z.string().trim().email(),
});

async function createSendTokens(user_id: string, email: string) {
   try {
      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 60 * 1000); // adds 1 hour to the current time
      const nowISO = now.toISOString();

      const verification = await prisma.password_reset_tokens.create({
         data: {
            user_id: user_id,
            created_at: nowISO,
         },
      });

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

      const templatePath = path.join(
         process.cwd(),
         'src/features/emailNewsletter/main.html'
      );
      let htmlTemplate = await readHtmlTemplate(templatePath);

      const host = process.env.HOST;
      const verificationLink = `${host}/account/forgot-reset/${verification.id}`;

      // Replace template placeholders
      htmlTemplate = htmlTemplate.replace('{{title}}', 'Reset Your Password');
      htmlTemplate = htmlTemplate.replace(
         '{{subtitle}}',
         'Password Reset Request'
      );
      htmlTemplate = htmlTemplate.replace(
         '{{message}}',
         `
            <p>You have requested to reset your password. Click the link below to proceed:</p>
            <p><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you did not request this reset, please ignore this email or contact support.</p>
            <p>This link will expire in 1 hour.</p>
            `
      );

      const mailOptions = {
         from: emailServer,
         to: email,
         subject: 'Password Reset Request',
         html: htmlTemplate,
      };

      await transporter.sendMail(mailOptions);

      return verification;
   } catch (error) {
      throw error;
   }
}

export async function POST(req: Request) {
   const validation = await parseJson(req, requestTokenSchema);
   if (!validation.ok) return validation.response;

   const { email } = validation.data;

   try {
      const user = await prisma.users.findUnique({ where: { email } });

      // Always return the same response so attackers can't enumerate accounts
      if (user) {
         await createSendTokens(user.id, user.email);
      }

      return NextResponse.json(
         { message: 'If an account exists, a reset link will be sent' },
         { status: 200 }
      );
   } catch (error) {
      console.error('Password reset request error:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
   }
}
