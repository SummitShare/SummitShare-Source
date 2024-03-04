import authConfig from "../auth.config"
import NextAuth from "next-auth"
import { 
  DEFAULT_REDIRECT_URL,
  publicRoutes,
  apiAuthPrefix,
  authRoutes,
  apiRoute
 } from "../route"

const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const{nextUrl}= req;
  const isLoggedIn =!!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiRoute =  nextUrl.pathname.startsWith(apiRoute);
  console.log("Route :",req.nextUrl.pathname); 
  console.log("Is Logged in: ",isLoggedIn);

  if (isApiAuthRoute||isApiRoute) {
    return null;
  }
  if (isAuthRoute){
    if (isLoggedIn){
      return Response.redirect(new URL(DEFAULT_REDIRECT_URL,nextUrl));
    }

    return null;
  }
  
  if(!isLoggedIn && !isPublicRoute){
    //return null;
     return Response.redirect(new URL("/auth/signIn",nextUrl));
  }

  return null;

})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}