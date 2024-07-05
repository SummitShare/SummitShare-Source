import { passwordCompare } from '@/utils/methods/auth/passwordCompare';
import NextAuth, {
  ExtendedJWT,
  ExtendedSession,
  ExtendedUser,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [],
// })

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        //

        let user = null;

        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const email = String(credentials.email);
        const password = String(credentials.password);

        const {
          compare,
          message,
          error,
          user: foundUser,
        } = await passwordCompare(email, password);
        user = foundUser;

        //console.log(`foundUser ${{ foundUser }}`)
        if (!user) {
          return null;
        }

        // return json object with the user data
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          bio: user.bio,
          email_verified: user.email_verified,
          type: user.type,
          user_wallets: user.user_wallets,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user is defined, it's an initial sign-in
      if (user) {
        // Assuming `user` has been correctly populated with extended fields
        const customUser = user as ExtendedUser; // Type assertion to your extended user type

        token = {
          ...token,
          id: customUser.id,
          email: customUser.email,
          username: customUser.username,
          bio: customUser.bio,
          email_verified: customUser.email_verified,
          type: customUser.type,
          user_wallets: customUser.user_wallets,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = {
        ...session.user, // Retain existing session.user fields
        id: token.id,
        username: token.username,
        bio: token.bio,
        email_verified: token.email_verified,
        type: token.type,
        user_wallets: token.user_wallets,
      };

      return session;
    },
  },
  //   callbacks: {
  //     async jwt({ token, user }) {
  //       // If the user object exists, it means this is the initial sign in
  //       if (user) {
  //         //console.log(`jwt user ${JSON.stringify(user, null, 2)} `);
  //         const customUser = user as ExtendedUser;
  //         // Add user info to the token, but exclude the password
  //         token.id = user.id;
  //         token.email = user.email;
  //         token.username = customUser.username;
  //         token.bio = customUser.bio;
  //         token.email_verified = customUser.email_verified;
  //         token.type = customUser.type;
  //         token.user_wallets = customUser.user_wallets; // Assuming you have this info in your user object
  //         // Any other user properties you want to include, but avoid sensitive ones like password
  //       }
  //       //console.log(`jwt token ${JSON.stringify(token, null, 2)} `);
  //       return token;
  //     },
  //     async session({ session, token }) {
  //         //console.log("Entering session callback");
  //         const extendedSession: ExtendedSession = session as ExtendedSession;
  //         const extendedToken: ExtendedJWT = token as ExtendedJWT;

  //         // Now, safely transfer custom claims from the JWT to the session
  //         if (extendedToken.id) extendedSession.user.id = extendedToken.id;
  //         if (extendedToken.email) extendedSession.user.email = extendedToken.email;
  //         if (extendedToken.username) extendedSession.user.username = extendedToken.username;
  //         if (extendedToken.bio) extendedSession.user.bio = extendedToken.bio;
  //         if (extendedToken.email_verified !== undefined) extendedSession.user.email_verified = extendedToken.email_verified;
  //         if (extendedToken.type) extendedSession.user.type = extendedToken.type;
  //         if (extendedToken.user_wallets) extendedSession.user.user_wallets = extendedToken.user_wallets;
  //         //console.log(`session ${JSON.stringify(session, null, 2)} `);
  //         return extendedSession;
  //       },
  //   },
});

export { handler as GET, handler as POST };
