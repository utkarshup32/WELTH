// C:\Users\HP\OneDrive\Desktop\WELTH\middleware.js

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"; // You might need NextResponse later, keep it for safety.

export default clerkMiddleware();

// Optionally, if you want to define specific routes for Clerk, you can uncomment and adjust this:
/*
export const config = {
  matcher: [
    // Exclude files with a specific extension to avoid re-running the middleware on static files
    '/((?!.*\\..*|_next).*)',
    // Re-include any files in `_next` that might need authentication, like API routes
    '/(api|trpc)(.*)',
  ],
};
*/