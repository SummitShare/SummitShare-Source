import { NextResponse } from 'next/server'
import { transporter, emailServer } from '../../../../config/nodemailer'
import { PrismaClient } from '@prisma/client'
import crypto from 'node:crypto'
const prisma = new PrismaClient()


export async function POST(req: Request , res : NextResponse) {
    
    try {

        const { email, password } = await req.json();
        // Hash password (You can use bcrypt or similar libraries)
        const hashedPassword = password; // Replace with hashed password
        
        // Create user
        const user = await prisma.users.create({
        data: {
            email,
            password: hashedPassword,
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
            id : id,
            user_id: user.id ,
            token: token,
            created_at: nowISO,
            expires: expiresISO,
        },
        });
    
        const host = req.headers.get('Host');
        console.log(host);
        const verificationLink = `http://${host}/api/verifyEmail?token=${token}`;
        console.log(verificationLink);
    
        const mailOptions = {
        from: emailServer,
        to: email,
        subject: 'Email Verification',
        text: `Click on this link to verify your email: ${verificationLink}`,
        };
    
        transporter.sendMail(mailOptions);
    

        return NextResponse.json({ success: 'User created and email sent'}, { status: 201 })
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({ faliure: error },{ status: 500 })
        
    }
    
}