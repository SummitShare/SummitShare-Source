import { passwordCompare } from '@/utils/methods/auth/passwordCompare';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

interface UserWallet {
   id: string;
   user_id: string;
   wallet_address: string;
   index: number | null;
}

interface CustomUser {
   id: string;
   email: string;
   username: string | null;
   bio: string | null;
   email_verified: boolean | null;
   type: string | null;
   user_wallets: UserWallet[];
}

declare module 'next-auth' {
   interface User extends CustomUser {}

   interface Session {
      user: CustomUser;
   }
}

declare module 'next-auth/jwt' {
   interface JWT extends CustomUser {}
}

const handler = NextAuth({
   secret: process.env.NEXTAUTH_SECRET,
   session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
   },
   cookies: {
      sessionToken: {
         name:
            process.env.NODE_ENV === 'production'
               ? '__Secure-next-auth.session-token'
               : 'next-auth.session-token',
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
         },
      },
      callbackUrl: {
         name:
            process.env.NODE_ENV === 'production'
               ? '__Secure-next-auth.callback-url'
               : 'next-auth.callback-url',
         options: {
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
         },
      },
      csrfToken: {
         name:
            process.env.NODE_ENV === 'production'
               ? '__Host-next-auth.csrf-token'
               : 'next-auth.csrf-token',
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
         },
      },
   },
   providers: [
      CredentialsProvider({
         id: 'credentials',
         name: 'Credentials',
         credentials: {
            email: {},
            password: {},
         },
         async authorize(credentials): Promise<User | null> {
            try {
               if (!credentials?.email || !credentials?.password) {
                  throw new Error('Missing credentials');
               }

               const email = String(credentials.email);
               const password = String(credentials.password);

               const {
                  compare,
                  message,
                  error,
                  user: foundUser,
               } = await passwordCompare(email, password);

               if (!foundUser || !compare) {
                  throw new Error(message || 'Invalid credentials');
               }

               const user: User = {
                  id: foundUser.id,
                  email: foundUser.email,
                  username: foundUser.username || null,
                  bio: foundUser.bio || null,
                  email_verified: foundUser.email_verified || null,
                  type: foundUser.type || null,
                  user_wallets: foundUser.user_wallets || [],
               };

               return user;
            } catch (error) {
               console.error('Authorization error:', error);
               return null;
            }
         },
      }),
   ],
   pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
   },
   callbacks: {
      async jwt({ token, user, trigger, session }) {
         if (trigger === 'update' && session) {
            // Handle token updates
            return { ...token, ...session.user };
         }

         if (user) {
            token.id = user.id;
            token.email = user.email;
            token.username = user.username;
            token.bio = user.bio;
            token.email_verified = user.email_verified;
            token.type = user.type;
            token.user_wallets = user.user_wallets;
         }
         return token;
      },
      async session({ session, token }) {
         session.user = {
            ...session.user,
            id: token.id,
            email: token.email,
            username: token.username,
            bio: token.bio,
            email_verified: token.email_verified,
            type: token.type,
            user_wallets: token.user_wallets,
         };

         return session;
      },
   },
   debug: process.env.NODE_ENV === 'development',
   logger: {
      error(code, metadata) {
         console.error(code, metadata);
      },
      warn(code) {
         console.warn(code);
      },
      debug(code, metadata) {
         console.debug(code, metadata);
      },
   },
});

export { handler as GET, handler as POST };
