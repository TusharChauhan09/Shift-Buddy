import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Ensure Node.js runtime for NextAuth + Prisma
export const runtime = "nodejs";

// Debug environment variables in development
if (process.env.NODE_ENV === "development") {
  console.log("NextAuth Environment Check:");
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing");
  console.log("GITHUB_ID:", process.env.GITHUB_ID ? "✓ Set" : "✗ Missing");
  console.log("GITHUB_SECRET:", process.env.GITHUB_SECRET ? "✓ Set" : "✗ Missing");
  console.log("AZURE_AD_CLIENT_ID:", process.env.AZURE_AD_CLIENT_ID ? "✓ Set" : "✗ Missing");
  console.log("AZURE_AD_CLIENT_SECRET:", process.env.AZURE_AD_CLIENT_SECRET ? "✓ Set" : "✗ Missing");
  console.log("AZURE_AD_TENANT_ID:", process.env.AZURE_AD_TENANT_ID ? "✓ Set" : "✗ Missing");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
