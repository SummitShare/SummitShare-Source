// import authConfig from "../auth.config";
// import NextAuth from "next-auth";
// import {
//   DEFAULT_REDIRECT_URL,
//   publicRoutes,
//   apiAuthPrefix,
//   authRoutes,
//   apiRoute,
// } from "../route";

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//   const isApiRoute = nextUrl.pathname.startsWith(apiRoute);
//   //console.log("Route :", req.nextUrl.pathname);
//   //console.log("Is Logged in: ", isLoggedIn);

//   if (isApiAuthRoute || isApiRoute) {
//     return null;
//   }

//   // if (!isLoggedIn) {
//   //   // return null;
//   //   return Response.redirect(new URL("/auth-sign-in", nextUrl));
//   // }
//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl));
//     }

//     return null;
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     // return null;
//     return Response.redirect(new URL("/auth-sign-in", nextUrl));
//   }

//   return null;
// });

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// export { default } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
   // `withAuth` augments your `Request` with the user's token.
   function middleware(req) {
      // //console.log("Route :", req.nextUrl.pathname)
      const isLoggedIn = !!req.nextauth;
      // //console.log("Is Logged in: ", isLoggedIn);
      // //console.log(`token : ${req.nextauth.token}`)
      return null;
   }
   //   {
   //     callbacks: {
   //       authorized: ({ token }) => token?.role === "admin",
   //     },
   //   }
);

export const config = {
   matcher: ['["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]'],
};
