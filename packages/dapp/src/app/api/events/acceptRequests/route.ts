import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request , res : NextResponse) {
    const { email, password}= await req.json()
    const host = req.headers.get('host');
    const url = new URL(req.url!, `http://${host}`);
    const queryParams = new URLSearchParams(url.search);
    const token = queryParams.get('token');
  
    if (token) {
      // Perform your email verification logic here
        console.log(`token = ${token}`)
      try {
        
        const request = await prisma.requests.findFirst({
          where: { token: token },  // Assuming token is a field in your userverification model
        });

            // Check if request is null or created_at is undefined.
           // Check if request is null or created_at is undefined.
            if (!request || !request.created_at) {
                return NextResponse.json({ error: "Request is null or created_at is not available." });
            }
            
            // Attempt to create a Date object from request.created_at.
            const createdAtDate = new Date(request.created_at);
            
            // Check if `createdAtDate` is a valid date.
            if (isNaN(createdAtDate.getTime())) {
                return NextResponse.json({ error: "Invalid created_at timestamp" });
            }
            
            // If we have a valid date, calculate the difference in time from now.
            const now = new Date();
            const timeDiff = now.getTime() - createdAtDate.getTime(); // Use `.getTime()` to get the time in milliseconds
            
            // Convert the time difference to days.
            const daysPassed = timeDiff / (1000 * 60 * 60 * 24);
            
            // Check if at least one day has passed.
            if (daysPassed > 1) {
                return NextResponse.json({ error: "Expired token" });
            } else {

                const user = await prisma.users.findUnique({
                    where: {email : email}
                })
                if (user?.password != password){
                    return NextResponse.json({ error: "incorrect password" });
                }
                await prisma.$transaction([
                    prisma.requests.update({
                      where: { token : token },
                      data: { 
                         status: "Accepted",
                      },
                    }),
                    prisma.stakeholders.create({
                        data:{
                            user_id: user?.id,
                            event_id: request.event_id,
                        }
                    })
             
                ]);
            }

        return NextResponse.json({ message: "Email verified successfully" },{status: 201});
      } catch (error) {
        return NextResponse.json({ message: 'faliure', error : error}, { status: 400 })
      }
    } else {
        return NextResponse.json({ message: 'faliure'}, { status: 400 })
    }
   
  
}
