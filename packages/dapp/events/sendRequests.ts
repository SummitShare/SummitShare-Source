import prisma from "../config/db";
import { transporter, emailServer } from "../config/nodemailer";
import crypto from 'node:crypto';

interface EmailStatus {
    exists: boolean;
    sent: boolean;
    status: number;
}

interface EmailArray extends Array<string> {}

async function handleEmailProcessing(email: string, eventID: string, host: string): Promise<EmailStatus> {
    // Check if the email is associated with a user
    const user = await prisma.users.findUnique({ where: { email } });
    const emailExists = !!user;

    const t = crypto.randomUUID();
    const verificationLink = `http://${host}/api/acceptRequests?token=${t}`;
    const mailOptions = {
        from: emailServer,
        to: email,
        subject: 'Your Subject Here',
        text: 'Your email content here',
        // html: '<p>Your HTML content here</p>', // If you want to send HTML formatted email
    };

    let emailSent = false;
    let sendStatus = 0; // Default to failure status

    // Attempt to send the email and record the result
    try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
        sendStatus = 1; // Email sent successfully

        // Create a request only if the email was sent successfully
        await prisma.requests.create({
            data: {
                event_id: eventID, 
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

export default async function sendRequests(emailsArray: EmailArray, eventID: string, host: string): Promise<Record<string, EmailStatus>> {
    const emailStatuses: Record<string, EmailStatus> = {};

    for (const email of emailsArray) {
        const result = await handleEmailProcessing(email, eventID, host);
        emailStatuses[email] = {
            exists: result.exists,
            sent: result.sent,
            status: result.status
        };
    }

    return emailStatuses;
}
