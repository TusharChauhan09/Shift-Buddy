import { NextResponse } from "next/server";

export async function GET() {
  // Only show this in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
    GITHUB_ID: process.env.GITHUB_ID ? "✓ Set" : "✗ Missing",
    GITHUB_SECRET: process.env.GITHUB_SECRET ? "✓ Set" : "✗ Missing",
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID ? "✓ Set" : "✗ Missing",
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? "✓ Set" : "✗ Missing",
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID ? "✓ Set" : "✗ Missing",
  };

  return NextResponse.json(envCheck);
}