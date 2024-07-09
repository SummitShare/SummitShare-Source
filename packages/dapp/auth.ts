// import NextAuth from "next-auth"
// import authConfig from "./auth.config"
// import {PrismaAdapter} from "@auth/prisma-adapter"

// import prisma from "./config/db"

// export const { handlers : {GET,POST},
//     auth,
//     signIn,
//     signOut
// } =  NextAuth({
//     // callbacks: {
//     //     async session({session,}){
//     //         ////console.log("auth ts",{sessionToken: session})
//     //         return session;
//     //     },
//     //     async jwt(token) {
//     //         ////console.log("auth ts",  {token,})
//     //         return token;
//     //     }
//     // },
//     //@ts-ignore
//     adapter: PrismaAdapter(prisma),
//     session: { strategy: "jwt" },
//     ...authConfig,
// });

// import { passwordCompare } from "@/utils/methods/auth/passwordCompare";
// import NextAuth from "next-auth"
// import Credentials from "next-auth/providers/credentials"

// export const { handlers,  signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         email: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         let user = null

//         if (!credentials || !credentials.email || !credentials.password) {
//             return null;
//         }
//         const email  =  String(credentials.email) ;
//         const password = String(credentials.password);

//         const {compare, message, error, user: foundUser} = await passwordCompare(email, password);
//         user = foundUser

//         if (!user) {
//           throw new Error("User not found.")
//         }

//         // return json object with the user data
//         return user;
//       },
//     }),
//   ],
// })
