import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import 'dotenv/config'

const prisma = new PrismaClient();

// Define a type that includes only the data we want to return from the authorize function.
type AuthorizedUser = {
  id: string;
  email: string;
};

export default NextAuth({

  providers: [

    CredentialsProvider({
        name: "Credentials",
        //Sigin Callback goes here
              credentials: {
                email: { label: "Email", type: "text", placeholder: "gavin@hooli.com"},
                password: {  label: "Password", type: "password" }
              },


          //@ts-expect-error
         authorize: async (credentials: Record<string, string>) => {
          // Connect to database and find user by email
          const user = await prisma.users.findUnique({
            where: { email: credentials.email },
          });
  
          // If no user is found or password doesn't match, return null
          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error('Invalid email or password');
          }

        // Return a user of type AuthorizedUser
        return { id: user.id, email: user.email } as AuthorizedUser;
      }
    })
  ],

  session: {
    // Use JWT for session handling
    //@ts-expect-error
    jwt: true,
    // Set the session duration to 1 hour
    maxAge: 60 * 60, // 1 hour in seconds
  },
//JWT here
  jwt: {
    // Set the secret for encoding the JWT. Use a secure, random string.
    secret: process.env.JWT_SECRET,

    encode: async ({ secret, token, maxAge }) => {
      const jwtClaims = {
           //@ts-ignore
        sub: token.sub.toString(),
           //@ts-ignore
        name: token.name,
           //@ts-ignore
        email: token.email,
        iat: Date.now() / 1000,
           //@ts-ignore
        exp: Math.floor(Date.now() / 1000) + maxAge,
      };

      //Encode
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
      return encodedToken;
    },
    //Decode
    //@ts-expect-error
    decode: async ({ secret, token, maxAge }) => {
         //@ts-ignore
      const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
      return decodedToken;
    },
  },

  pages: {
    signIn: './api/signup', // The URL to the sign-in page
   // signOut: '/auth/signout', // The URL to the sign-out page
   // error: '/auth/error', // Error page
    //verifyRequest: '/auth/verify-request', // Page where a user is directed to check their email
  },
  

  // Debug to console set to true for development set to false when pushed to production!!
  debug: false,
});


