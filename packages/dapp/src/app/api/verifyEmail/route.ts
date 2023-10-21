import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request , res : NextResponse) {
    const host = req.headers.get('host');
    const url = new URL(req.url!, `http://${host}`);
    const queryParams = new URLSearchParams(url.search);
    const token = queryParams.get('token');
  
    if (token) {
      // Perform your email verification logic here
      try {
        //@ts-ignore
        const verificationRecord = await prisma.userverification.findUnique({
          where: { token: token },  // Assuming token is a field in your userverification model
        });
        
        if (!verificationRecord) {
          return NextResponse.json({ error: "Invalid token" });
        }
        
        if (new Date() > new Date(verificationRecord.expires ?? '')) {  // Coalescing to an empty string if undefined
          return NextResponse.json({ error: "Expired token" });
        }
        // const verificationRecord = await prisma.userverification.findUnique({
        //   where: { token },
        // });
    
        // if (!verificationRecord || new Date() > new Date(verificationRecord.expires)) {
        //   return NextResponse.json({ error: "Invalid or expired token" });
        // }
    
        await prisma.$transaction([
          prisma.users.update({
            where: { userid: verificationRecord.userid },
            data: { 
              isemailverified: true,
              roleid: 1  // Replace 'admin_role_id_here' with the actual RoleID for admin users
            },
          }),
          //@ts-ignore
          prisma.userVerification.delete({
            where: { id: verificationRecord.id },
          }),
        ]);
    
        return NextResponse.json({ message: "Email verified successfully" },{status: 201});
      } catch (error) {
        return NextResponse.json({ message: 'faliure', error : error}, { status: 400 })
      }
    } else {
        return NextResponse.json({ message: 'faliure'}, { status: 400 })
    }
   


 

  
}
