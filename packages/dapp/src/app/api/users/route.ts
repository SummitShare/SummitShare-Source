import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, response: NextResponse) {
    // Check if the user is authenticated
   // const session = await getSession({ req: request as any });
        
    // if (!session) {
    //     // User is not authenticated
    //     return NextResponse.json({ no: 'failure',  }, { status: 401 })
    // }

    const allUsers = await prisma.users.findMany();
    console.log(allUsers);
    console.log("get");
    return NextResponse.json({ yes: 'great success', allUsers }, { status: 200 });
}
