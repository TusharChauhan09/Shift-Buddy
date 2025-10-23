import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Ensure Node.js runtime for NextAuth + Prisma
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
