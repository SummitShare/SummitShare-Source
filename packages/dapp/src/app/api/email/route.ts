import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { transporter, emailServer } from '../../../../config/nodemailer'
const prisma = new PrismaClient()

export async function POST(request: Request , response : NextResponse) {
    const { subject, receiver } =  await request.json();
    try {

        const mailOptions = {
            from: emailServer,
            to: receiver,
        }
        await transporter.sendMail({
            ...mailOptions,
            subject: subject,
            text: "testing",
            html: "<h1>Test title<h1/>"
        })
        return NextResponse.json({ yes: 'great success'}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ no: 'you are a faliure'}, { status: 200 })
    }
   
}