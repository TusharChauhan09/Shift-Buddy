import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import Credentials from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const credentialsSchema = z.object({
  registrationNumber: z.string().min(3),
  password: z.string().min(6),
});

// Debug provider configuration (dev only)
if (process.env.NODE_ENV === "development") {
  console.log("Configuring NextAuth providers...");
  console.log(
    "GitHub credentials available:",
    !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET)
  );
  console.log(
    "Google credentials available:",
    !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  );
  console.log(
    "Azure AD credentials available:",
    !!(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET)
  );
}

const providers = [
  // Always add GitHub provider if credentials exist
  ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
    ? [
        GitHub({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
          authorization: {
            params: {
              scope: "read:user user:email",
            },
          },
        }),
      ]
    : []),
  // Always add Google provider if credentials exist
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),
      ]
    : []),
  // Always add Azure AD provider if credentials exist
  ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
    ? [
        AzureADProvider({
          clientId: process.env.AZURE_AD_CLIENT_ID,
          clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
          tenantId: process.env.AZURE_AD_TENANT_ID || "common",
          authorization: {
            params: {
              scope: "openid profile email",
            },
          },
        }),
      ]
    : []),
  Credentials({
    name: "Credentials",
    credentials: {
      registrationNumber: { label: "Registration Number", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      if (!process.env.DATABASE_URL) {
        console.warn("No DATABASE_URL configured - credentials auth disabled");
        return null;
      }

      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      const { registrationNumber, password } = parsed.data;
      const normalizedReg = registrationNumber.trim().toUpperCase();

      try {
        const user = await prisma.user.findUnique({
          where: { registrationNumber: normalizedReg },
        });
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
        };
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Database error during authentication:", error);
        }
        return null;
      }
    },
  }),
];

const maybeAdapter = process.env.DATABASE_URL
  ? PrismaAdapter(prisma)
  : undefined;

export const authOptions = {
  // Make adapter optional for local/dev without DB
  adapter: maybeAdapter,
  session: { strategy: "jwt" as const },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "insecure-dev-secret-change-me"
      : undefined),
  providers,
  pages: {
    signIn: "/auth/signup",
  },
  callbacks: {
    async signIn({ account }: { account?: { provider?: string } | null }) {
      // Allow OAuth and credentials signins. PrismaAdapter will upsert users/accounts for OAuth.
      if (
        account?.provider === "github" ||
        account?.provider === "azure-ad" ||
        account?.provider === "credentials"
      ) {
        return true;
      }
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      // Persist the user id to the token on first sign in
      if (user && (user as { id?: string }).id) {
        token.id = (user as { id: string }).id;
      }
      // Look up registrationNumber and phoneNumber when possible
      if (token?.id && process.env.DATABASE_URL) {
        try {
          const u = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              registrationNumber: true,
              phoneNumber: true,
              isAdmin: true,
            },
          });
          token.registrationNumber = u?.registrationNumber ?? null;
          token.phoneNumber = u?.phoneNumber ?? null;
          token.isAdmin = u?.isAdmin ?? false;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Failed to fetch user data:", error);
          }
          token.registrationNumber = null;
          token.phoneNumber = null;
          token.isAdmin = false;
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token?.id) {
        session.user = { ...session.user, id: token.id as string };
      }
      session.registrationNumber = token.registrationNumber ?? null;
      session.phoneNumber = token.phoneNumber ?? null;
      session.isAdmin = token.isAdmin ?? false;
      return session;
    },
  },
};

export const getAuth = async () => {
  const session = await getServerSession(authOptions);
  return session as
    | (Session & {
        registrationNumber?: string | null;
        phoneNumber?: string | null;
        isAdmin?: boolean;
      })
    | null;
};
