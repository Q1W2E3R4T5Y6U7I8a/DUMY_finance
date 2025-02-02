import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (routes that do not require authentication)
const isPublic = createRouteMatcher([
  '/sign-in(.*)', // All sign-in sub-routes
  '/sign-up(.*)'  // All sign-up sub-routes
]);

const isProtectedRoute = createRouteMatcher([
    '/',                 // Root path
    '/dashboard(.*)',    // All dashboard sub-routes
    '/forum(.*)'         // All forum sub-routes
  ]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()

        return NextResponse.next();
  })

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};