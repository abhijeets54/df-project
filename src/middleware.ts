import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Allow all routes under sign-in and sign-up including the catch-all routes
  const publicPaths = ["/", "/sign-in", "/sign-up"];
  
  // Check if the current path is in the public paths
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // If it's a public path, allow the request to proceed
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for authentication - this is a simplified version
  // In a real implementation, you would check for the Clerk session
  const hasSession = request.cookies.has("__session");

  // If not authenticated and not a public path, redirect to sign-in
  if (!hasSession) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Continue with the request if authenticated
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!.+\.[\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};