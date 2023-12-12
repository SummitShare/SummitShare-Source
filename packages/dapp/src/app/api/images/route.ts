import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { transporter,emailServer } from '../../../../config/nodemailer'
import prisma from '../../../../config/db'
import crypto from 'node:crypto'
import { type } from 'node:os'

type image_type_enum = 'Profile' | 'Gallery' | 'Cover' 


export async function POST(req: Request, res: NextResponse) {
    try {
        // Parse the request body
        
        const requestBody = await req.json();
        const { url , event_id , user_id,imageType }: { url :string , event_id: string , user_id:string , imageType:image_type_enum  } = requestBody;
        
        const newImage = await prisma.user_images.create({
            data:{
              user_id: user_id,
              s3_url: url,
              image_type: imageType
            }
        })


        // Return the status of all operations
        return NextResponse.json({ status: 'ok' , url: url }, { status: 200 });
       
      } catch (error) {
        console.error('Error in POST endpoint:', error);
        return NextResponse.json({ error: 'creating image.' }, { status: 500 });
      }
  }