// import Credentials from "next-auth/providers/credentials"
// import { passwordCompare } from "@/utils/methods/auth/passwordCompare";
// import { User as NextAuthUser } from 'next-auth';

// import type { NextAuthConfig } from "next-auth"

// export default {
//   providers: [
//     Credentials({
//         async authorize(credentials) {
//             if (!credentials || !credentials.email || !credentials.password) {
//                     return null;
//                 }
//             const email  =  String(credentials.email) ;
//             const password = String(credentials.password);

//             try {

//                 const {compare, message, error, user: foundUser} = await passwordCompare(email, password);
//                 if (compare && foundUser) {
//                     //console.log("auth config - user", foundUser)
//                     return foundUser as any;
//                 }else{
//                     //console.log( "password error  - message: ", message, "error: ", error)
//                     return null;
//                 }

//             } catch (error) {
//                 console.error("auth config -   Authorize error:", error);
//                 return null;
//             }
//         }
//     }),
//   ],
// } satisfies NextAuthConfig
