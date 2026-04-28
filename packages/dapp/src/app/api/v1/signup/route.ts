import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../../../../../config/db';
import { emailServer, transporter } from '../../../../../config/nodemailer';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parseJson } from '@/lib/apiValidation';

const signupSchema = z
   .object({
      email: z.string().trim().email(),
      password: z.string().min(8).max(200),
      username: z.string().trim().min(1).max(50).optional(),
      type: z.enum(['exhibitor', 'visitor']),
      wallet_address: z
         .string()
         .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address')
         .optional(),
      code: z.string().max(50).optional(),
   })
   .refine((data) => data.type !== 'exhibitor' || !!data.wallet_address, {
      message: 'wallet_address is required for exhibitor signups',
      path: ['wallet_address'],
   });

type UserRecord = {
   id: string;
   email: string;
};

async function readHtmlTemplate(filePath: string): Promise<string> {
   try {
      const htmlContent = await fs.readFile(filePath, 'utf-8');
      return htmlContent;
   } catch (error) {
      throw new Error('Error reading HTML template');
   }
}

async function createSendTokens(user: UserRecord, email: string) {
   try {
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

      // Read the HTML template
      const templatePath = path.join(
         process.cwd(),
         'src/features/emailNewsletter/main.html'
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
      console.error('createSendTokens error:', error);
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
   const verificationLink = `${host}/verification/email/${token}`;

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
      const result = await prisma.$transaction(async (tx: any) => {
         const user = await tx.users.create({
            data: {
               email,
               password: hashedPassword,
               username,
               type: type,
            },
         });

         const wallet = await tx.user_wallets.create({
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
   type: string,
   code: string
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

      if (code == process.env.AD_CODE) {
         const ad = await prisma.airdrops.create({
            data: {
               user_id: user.id,
            },
         });
      }

      const verification = await createSendTokens(user, email);

      return { user, verification };
   } catch (error) {
      console.error('Error creating visitor:', error);
      throw error;
   }
}

export async function POST(req: Request) {
   const validation = await parseJson(req, signupSchema);
   if (!validation.ok) return validation.response;

   const { email, password, username, type, wallet_address, code } = validation.data;

   try {
      if (username) {
         const existingUserName = await prisma.users.findUnique({
            where: { username },
         });
         if (existingUserName) {
            return NextResponse.json(
               { message: 'Username already exists' },
               { status: 409 }
            );
         }
      }

      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
         return NextResponse.json(
            { message: 'User already exists' },
            { status: 409 }
         );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      if (type === 'exhibitor') {
         await createExhibitor(
            email,
            hashedPassword,
            username ?? randomUUID(),
            type,
            wallet_address!
         );
      } else {
         await createVisitor(
            email,
            hashedPassword,
            username ?? randomUUID(),
            type,
            code ?? ''
         );
      }

      return NextResponse.json(
         { success: 'User created and email sent' },
         { status: 201 }
      );
   } catch (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
         { message: 'Internal server error' },
         { status: 500 }
      );
   }
}
