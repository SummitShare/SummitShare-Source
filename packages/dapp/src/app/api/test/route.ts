import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { signIn } from '../../../../auth'
import { DEFAULT_REDIRECT_URL } from '../../../../route'
import { AuthError } from 'next-auth' 
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()




export async function POST(req: Request , response : NextResponse) {

    const data = await req.json();
    console.log(`\n\n\n\n\n\n ${data.email}`)

    const { email, password } = data;
    try {
        await signIn("credentials",{
          email,
          password,
          redirectTo: DEFAULT_REDIRECT_URL,
        })

        return NextResponse.json({ success:"success"}, { status: 200 })
    } catch (error) {
      if (error instanceof AuthError) {
         switch (error.type) {
          case "CredentialsSignin":
            console.log("cred error ", error)
            return {error : " invalid credentials",}
          default: 
            return{ error: " something went wrong"}
         
         }
      }
       throw error ;
       
    }
  
}