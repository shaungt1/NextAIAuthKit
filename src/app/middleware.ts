// // Import necessary modules from Next.js and NextAuth
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server"; // Use NextRequest instead of Request

// /**
//  * Middleware function to protect specific routes by verifying JWT tokens.
//  * @param req - Incoming request, expected to be of type NextRequest.
//  * @returns A response that either allows the request to proceed or redirects to the login page.
//  */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths requiring authentication
const protectedPaths = ['/settings', '/admin', '/profile'];

// Paths requiring specific roles
const adminOnlyPaths = ['/admin']; // Example for admin-only routes

/**
 * Middleware for Role-Based Access Control
 * - Checks user authentication and roles for protected routes.
 * - Redirects unauthorized users to login or error pages.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Extract the current path
  const currentPath = req.nextUrl.pathname;

  if (protectedPaths.some((path) => currentPath.startsWith(path))) {
    // Ensure the user is logged in
    if (!token) {
      console.warn('[Middleware] Unauthorized access attempt. Redirecting to login.');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Check for admin-only routes
    if (adminOnlyPaths.includes(currentPath) && token.role !== 'ADMIN') {
      console.error('[Middleware] Admin access required. Redirecting to error page.');
      return NextResponse.redirect(new URL('/auth/error', req.url));
    }
  }

  return NextResponse.next(); // Allow the request
}

// Apply middleware to all routes
export const config = {
  matcher: ['/(.*)'], // Apply to all paths
};



// export async function middleware(req: NextRequest) {
//   // Retrieve the token from the request using NextAuth's getToken
//   const token = await getToken({ req });

//   // Define an array of routes that require authentication
//   const protectedRoutes = ["/profile"];

//   /**
//    * Check if the current request URL includes any of the protected routes
//    * and if there's no valid token. If both conditions are true, redirect to the login page.
//    */
//   if (protectedRoutes.some((route) => req.nextUrl.pathname.includes(route)) && !token) {
//     // Construct the redirect URL to the login page
//     const loginUrl = new URL("/auth/login", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // If the user has a valid token or the route is not protected, proceed with the request
//   return NextResponse.next();
// }

// /**
//  * Config object to specify which routes this middleware should apply to.
//  * The matcher uses patterns to match routes like /profile and /dashboard.
//  */
// export const config = {
//   matcher: ["/profile/:path*", "/dashboard/:path*"],
// };
