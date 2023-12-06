import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "gavin@hooli.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Please enter email and password");
        }
    
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });
    
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.id,
            Email: user.email, // 
            username: user.username, 
            wallet_address: user.wallet_address
          };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/(UserPages)/auth/signin', // custom sign-in page for front end
  },
  debug: process.env.NODE_ENV === 'development',
});
