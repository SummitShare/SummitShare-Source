
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';


export async function GET(req: Request, res: NextResponse) {
  const host = req.headers.get('host');
  const url = new URL(req.url!, `http://${host}`);
  const queryParams = new URLSearchParams(url.search);
  const token = queryParams.get('token');

  if (!token){
    return NextResponse.json({ message: 'token not sent'}, { status: 403 })
  }
    
  try {
    console.log(`recieved token ${token}`)
    const verificationRecord = await prisma.email_verification.findFirst({
      where: { token: token },
    });

    console.log(`vrecord ${verificationRecord}`)

    if (!verificationRecord) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    if (new Date() > new Date(verificationRecord.expires ?? '')) {

      return NextResponse.json({ message: "token expired request a new one" }, { status: 401 });
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

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'faliure', error: error }, { status: 500 })
  }

}
