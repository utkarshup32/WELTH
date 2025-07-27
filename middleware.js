// C:\Users\HP\OneDrive\Desktop\WELTH\middleware.js

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export default clerkMiddleware();

// Optional: you can add a matcher if needed, but for now, keep it simple
/*
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/(api|trpc)(.*)',
  ],
};
*/