import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"

import prisma from "./config/db"

export const { handlers : {GET,POST},
    auth,
    signIn,
    signOut
} =  NextAuth({
    // callbacks: {
    //     async session({session,}){
    //         console.log("auth ts",{sessionToken: session})
    //         return session;
    //     },
    //     async jwt(token) {
    //         console.log("auth ts",  {token,})
    //         return token;
    //     }
    // },
    //@ts-ignore
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
});