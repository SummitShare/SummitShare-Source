import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';

export async function GET(req: Request, res: NextResponse) {
   const host = req.headers.get('host');
   const url = new URL(req.url!, `http://${host}`);
   const queryParams = new URLSearchParams(url.search);
   const token = queryParams.get('token');
   ////console.log("url being sent, ", url)

   if (!token) {
      //console.log("Token not sent");
      return NextResponse.json({ message: 'token not sent' }, { status: 403 });
   }

   try {
      // //console.log(`recieved token ${token}`)
      const verificationRecord = await prisma.email_verification.findFirst({
         where: { token: token },
      });

      ////console.log(`vrecord ${verificationRecord}`)

      if (!verificationRecord) {
         ////console.log("Invalid token v1: line 25");
         return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
      }

      // Assuming verificationRecord.expires is in a consistent format, e.g., ISO 8601
      if (!verificationRecord.expires) {
         ////console.log("Invalid token v2");
         // Handle cases where expires data might be missing or invalid
         return NextResponse.json(
            { message: 'Invalid token data, cannot verify expiration.' },
            { status: 400 }
         );
      }

      // Parse the expiration date string safely
      const expirationDate = new Date(verificationRecord.expires);
      if (Number.isNaN(expirationDate.getTime())) {
         // Check if the date parsed is valid
         return NextResponse.json(
            { message: 'Invalid expiration date, request a new token.' },
            { status: 500 }
         );
      }
      // ////console.log(`expiration date ${JSON.stringify(expirationDate.getTime())}`)
      // ////console.log(`new date ${JSON.stringify(new Date().getTime())}`)
      // Compare the current date (in UTC) to the expiration date
      if (new Date() > expirationDate) {
         return NextResponse.json(
            { message: 'Token expired, request a new one' },
            { status: 401 }
         );
      }

      await prisma.$transaction([
         prisma.users.update({
            where: { id: verificationRecord.user_id! },
            data: {
               email_verified: true,
            },
         }),

         prisma.email_verification.delete({
            where: { id: verificationRecord.id! },
         }),
      ]);

      return NextResponse.json(
         { message: 'Email verified successfully' },
         { status: 200 }
      );
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { message: 'faliure', error: error },
         { status: 500 }
      );
   }
}
