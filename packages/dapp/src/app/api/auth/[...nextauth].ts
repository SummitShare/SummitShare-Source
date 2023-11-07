// // Required imports for NextAuth.js and database interaction
// import NextAuth, { Account, Awaitable, Profile, Session, User } from "next-auth";
// import Providers from "next-auth/providers";
// import { PrismaClient } from '@prisma/client'; //  based on setup
// import jwt from "jsonwebtoken";
// import bcrypt from 'bcryptjs';

// // Corrected import for JWT type
// import type { JWT } from 'next-auth/jwt';
// import dotenv from 'dotenv';
// import { AdapterUser } from "next-auth/adapters";

// interface ExtendedSession extends Session {
//   userId?: string;
//   email?: string;
//   walletaddress?: string;
// }


// dotenv.config();

// // Initialize the database client
// const prisma = new PrismaClient();

// //Temporary fix for credentials types not being found
// declare module 'next-auth/providers' {
//   var Credentials: any;
// }

// export default NextAuth({
//   providers: [
//     Providers.Credentials({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },

//       authorize: async (credentials: { email: string; password: string; name: string; id: string;}) => {
//         // logic to validate credentials against prisma
//         const user = await prisma.users.findUnique({
//           where: { email: credentials.email },
//         });

//         if (user && await bcrypt.compare(credentials.password, user.password)) {//Bcrypt
//           return { userid: user.userid, email: user.email, walletaddress: user.walletaddress };
//       }
      
//         return null;
//       },
//     }),
//   ],

//   secret: process.env.SECRET, // Secret for signing JWT, .env var
//   session: {
//     maxAge: 30 * 60, // 30 minutes
//   },

//   jwt: {
//     //encryption: true,
//     encode: async ({ secret, token, maxAge = 3600 }) => { // default value for maxAge
//       if (!token || !token.id || !secret) { // Check for undefined token or secret
//         throw new Error("Bad Token or Secret");
//       }
//       const jwtClaims = {
//         "sub": token.id.toString(),
//         "name": token.name || "",
//         "email": token.email || "",
//         "iat": Date.now() / 1000,
//         "exp": Math.floor(Date.now() / 1000) + maxAge,
//       };

//       if (!secret) {
//         throw new Error("Secret is undefined");
//       }

//       const encodedToken = jwt.sign(jwtClaims, secret as string, { algorithm: 'HS256' });
//       return encodedToken;
//     },
//     decode: async ({ secret, token }) => {
//       if (!secret) {
//         throw new Error("Secret is undefined");
//       }
      
//       if (typeof secret !== 'string') {
//         throw new Error('Secret must be a string');
//       }
      
//       const decodedToken = jwt.verify(token, secret as string, { algorithms: ['HS256'] });
      
//       return decodedToken;
//     }
//   },
  
  

//   callbacks: {
//     jwt: async (params: {
//       token: JWT;
//       user: User | AdapterUser;
//       account: Account | null;
//       profile?: Profile | undefined;
//       trigger?: "signIn" | "signUp" | "update" | undefined;
//       isNewUser?: boolean | undefined;
//       session?: any;
//     }) => {
//       let { token, user } = params;
    
//       if (user) {
//         if (!token) {
//           token = {};
//         }
//         // Assuming that 'user' has 'id', 'email', and 'walletAddress' properties.
//         // Adjust this block according to actual 'user' type on data tables.
//         token.id = user.id as string;
//         token.email = user.email as string;
//         token.walletAddress = (user as any).walletAddress as string;  // Changed 'name' to 'walletAddress'
//       }
      
//       return token as JWT;
//     },    


//     session: async (params: { session: Session; token: JWT; user: any }) => {
//       const { session, token } = params;
//       const customSession = session as ExtendedSession; // Cast to the extended type
      
//       if (token) {
//         // Check if each property is a string before assigning it to the session
//         if (typeof token.id === 'string') {
//           customSession.userId = token.id;
//         }
//         if (typeof token.email === 'string') {
//           customSession.email = token.email;
//         }
//         if (typeof token.walletAddress === 'string') {
//           customSession.walletaddress = token.walletAddress;
//         }
//       }
      
//       return customSession as Awaitable<Session>;
//     },

//     },
//   },
// );
