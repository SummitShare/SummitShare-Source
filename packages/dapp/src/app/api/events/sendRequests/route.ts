import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { transporter,emailServer } from '../../../../../config/nodemailer'
import crypto from 'node:crypto'

const prisma = new PrismaClient()
interface EmailStatus {
    exists: boolean;
    sent: boolean;
    status: number;
}
interface EmailArray extends Array<string> {}


export async function POST(req: Request, res: NextResponse) {
            
    
    // Parse the request body
    const requestBody = await req.json();
    const { emailsArray, eventID }: { emailsArray: EmailArray, eventID: string } = requestBody;
    const host = req.headers.get('Host') || 'localhost:3000';
    const emailStatuses: Record<string, EmailStatus> = {};

    async function handleEmailProcessing(email: string, eventID: string, host: string) {
      // Check if the email is associated with a user
      const user = await prisma.users.findUnique({ where: { email },
      });
      
      const emailExists = !!user;
      
      let emailSent = false;
      let sendStatus = 0; // Default to failure status
      const t = crypto.randomUUID();
      const verificationLink = `http://${host}/api/acceptRequests?token=${t}`;
  
      // Prepare the email options
      const mailOptions = {
          from: emailServer,
          to: email,
          subject: 'Your Subject Here',
          text: 'Your email content here',
          // html: '<p>Your HTML content here</p>', // Uncomment if you want to send HTML formatted email
      };
  
      // Try to send the email
      try {
          await transporter.sendMail(mailOptions);
          emailSent = true;
          sendStatus = 1; // Email sent successfully
  
          // Create a request only if the email was sent successfully
          // await prisma.requests.create({
          //     data: {
          //         event_id: eventID, 
          //         email_address: email,
          //         token: t
          //         // status will be "Pending" by default as defined in the schema
          //     },
          // });
      } catch (error) {
          console.error('Email send error:', error);
          emailSent = false;
          sendStatus = 0; // Email failed to send
      }
  
      return { emailExists, emailSent, sendStatus };
   }  


    try {
         
        //Iterate over the array of emails
        for (const email of emailsArray) {
            let emailExists = false;

            let emailSent = false;
            let sendStatus = 0; // Default to failure status

            // Check if the email is associated with a user
            const user = await prisma.users.findUnique({
            where: { email },
            });

            // Record if the user exists
            emailExists = !!user;

            if (emailExists) {
                // If the user exists, prepare the email
                const t = crypto.randomUUID();
                const host = req.headers.get('Host');
                const verificationLink = `http://${host}/api/acceptRequests?token=${t}`;
                const mailOptions = {
                    from: emailServer,
                    to: email,
                    subject: 'Your Subject Here',
                    text: 'Your email content here',
                    // html: '<p>Your HTML content here</p>', // If you want to send HTML formatted email
                };

              // Attempt to send the email and record the result
              try {
                await transporter.sendMail(mailOptions);
                emailSent = true;
                sendStatus = 1; // Email sent successfullynpx prisma generate
                

                const request = await prisma.requests.create({
                    data: {
                        // Assuming you have event_id available, otherwise set it appropriately
                        event_id: eventID, 
                        email_address: email,
                        token: t
                        // status will be "Pending" by default as defined in the schema
                    },
                });
        
              } catch (sendError) {
                console.error('Email send error:', sendError);
                emailSent = false;
                sendStatus = 0; // Email failed to send
              }
            }

            // Record the status of the email attempt
            emailStatuses[email] = {
            exists: emailExists,
            sent: emailSent,
            status: sendStatus
            };

          const result = await  handleEmailProcessing(email,eventID,host)
          emailStatuses[email] = {
            exists: result.emailExists,
            sent: result.emailSent,
            status: result.sendStatus
          };
           
        }

        return NextResponse.json(emailStatuses, { status: 200 });
      } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
      }
  }


