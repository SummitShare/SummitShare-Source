// import { NextResponse } from 'next/server'
// import { AuthError } from 'next-auth';

// import { DEFAULT_REDIRECT_URL } from '../../../../../route';
// import { signIn } from '../../../../../auth';





// export async function POST(req: Request , response : NextResponse) {
//     const { email, password } = await req.json();
//     console.log(`\n ${email}  ${password}`)

    
//     try {
//         await signIn("credentials",{
//           email,
//           password,
//           redirectTo: 
//           DEFAULT_REDIRECT_URL,
//         })

//         return NextResponse.json({ success:"success"}, { status: 200 })
//     } catch (error) {
//       if (error instanceof AuthError) {
//          switch (error.type) {
//           case "CredentialsSignin":
//             console.log("cred error ", error)
//             return NextResponse.json({error : " invalid credentials"},{ status: 401 })
//           default: 
//           return NextResponse.json({error : "something went wrong"},{ status: 500 })      
//         }
//       }
//       console.log("server error ", error)
      
//       throw error
//     }
  
// }