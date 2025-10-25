import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { JWT } from "next-auth/jwt";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // If user is authenticated but accessing auth pages, redirect to home
    if (token && pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: "/auth/signup" },
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Allow access to auth pages if not authenticated
        if (pathname.startsWith("/auth/")) {
          return true;
        }

        // Require authentication for all other pages
        if (!token) return false;

        // Special requirements for hostel-change
        if (pathname.startsWith("/hostel-change")) {
          return Boolean((token as JWT).registrationNumber);
        }

        return true;
      },
    },
  }
);

export const config = { 
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (svg, png, jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ]
};
