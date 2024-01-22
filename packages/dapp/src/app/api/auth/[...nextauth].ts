// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();



// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "email@example.com" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials || !credentials.email || !credentials.password) {
//           return null;  
//         }
    
//         try {
//           const res = await fetch("http://localhost:3000/api/test", {
//             method: 'POST',
//             headers: {
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           });
    
//           const user = await res.json();
    
//           if (res.ok && user) {
//             return user;
//           } else {
//             return null;
//           }
//         } catch (error) {
//           console.error("Authorize error:", error);
//           return null;
//         }
//       },
//     }),
    
//   ],
//   // ... other NextAuth configurations ...
// });

// // export default NextAuth({
// //   providers: [
// //     CredentialsProvider({
// //       name: "Credentials",
// //       credentials: {
// //         email: { label: "Email", type: "text", placeholder: "a@example.com" },
// //         password: { label: "Password", type: "password" }
// //       },
// //       async authorize(credentials, _req) {
// //         const res = await fetch("http://localhost:3000/api/test", {
// //           method: 'POST',
// //           body: JSON.stringify(credentials),
// //           headers: { "Content-Type": "application/json" }
// //         })
// //         const user = await res.json()
  
// //         // If no error and we have user data, return it
// //         if (res.ok && user) {
// //           return user
// //         }
// //       },
    
// //     }),
// //   ],
// //   secret: process.env.JWT_SECRET,
// //   session: {
// //     strategy: "jwt",
// //     maxAge: 30 * 24 * 60 * 60, // 30 days
// //   },callbacks: {
// //     async jwt({ token, user }) {
// //       if (user) {
// //         token.id = user.id;
// //       }
// //       return token;
// //     },
// //     async session({ session, token }) {
// //       session.user.id = token.id;
// //       return session;
// //     },
// //   },
// //   pages: {
// //     signIn: '/(UserPages)/auth/signin', // custom sign-in page for front end
// //   },
// //   debug: process.env.NODE_ENV === 'development',
// // });
