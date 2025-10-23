import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { JWT } from "next-auth/jwt";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    pages: { signIn: "/auth/signin" },
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (!token) return false;
        if (pathname.startsWith("/hostel-change")) {
          return Boolean((token as JWT).registrationNumber);
        }
        return true;
      },
    },
  }
);

export const config = { matcher: ["/hostel-change"] };
