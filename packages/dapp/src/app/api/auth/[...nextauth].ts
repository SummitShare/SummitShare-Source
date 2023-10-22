// Required imports for NextAuth.js and database interaction
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaClient } from '@prisma/client'; //  based on setup
import jwt from "jsonwebtoken";


// Initialize the database client
const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // logic to validate credentials against prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && user.password === credentials.password) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  secret: process.env.SECRET, // Secret for signing JWT, .env var
  session: {
    jwt: true,
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    signingKey: process.env.JWT_SIGNING_KEY,
    encryption: true,
    encode: async ({ secret, token, maxAge }) => {
      const jwtClaims = {
        "sub": token.id.toString(),
        "name": token.name || "",
        "email": token.email || "",
        "iat": Date.now() / 1000,
        "exp": Math.floor(Date.now() / 1000) + maxAge,
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256'});
      return encodedToken;
    },
    decode: async ({ secret, token, maxAge }) => {
      const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256']});
      return decodedToken;
    },
  },
  callbacks: {
    jwt: async (token, user) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session: async (session, token) => {
      session.userId = token.id;
      session.email = token.email;
      session.name = token.name;
      return session;
    },
    async signOut(user, account, profile) {
      try {
        //  table 'UserSession' and a field 'userId'
        // You can delete or invalidate all sessions for the user
        await prisma.userSession.deleteMany({
          where: {
            userId: user.id,
          },
        });
        return true; // Return true to log the user out
      } catch (error) {
        console.error("Error during sign-out:", error);
        return false; // Return false to not log the user out
      }
    },
  },
});
