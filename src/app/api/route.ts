import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function POST(req: Request , res : NextResponse) {


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
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

   // Store verification data in UserVerification table
   const id = crypto.randomUUID()

    //@ts-ignore
    const verification = await prisma.userverification.create({
      data: {
        id : id,
        userid: user.userid ,
        token: token,
        expires: expires,
      },
    });
  
    const host = req.headers.get('Host');
    console.log(host)
    return NextResponse.json({ yes: 'great success' ,verification}, { status: 200 })
}