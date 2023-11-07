// import { PrismaClient } from '@prisma/client'
// import { NextResponse } from 'next/server'
// const prisma = new PrismaClient()

// export async function GET(request: Request , response : NextResponse) {
//     const allUsers = await prisma.users.findMany()
//     console.log(allUsers)
//     console.log("get")
//     return NextResponse.json({ yes: 'great success' ,allUsers}, { status: 200 })
// }