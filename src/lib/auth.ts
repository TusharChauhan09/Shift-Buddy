import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import AzureAD from "next-auth/providers/azure-ad";
import Credentials from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const credentialsSchema = z.object({
  registrationNumber: z.string().min(3),
  password: z.string().min(6),
});

const providers = [
  // Only add OAuth providers if credentials are set
  ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
    ? [GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })]
    : []),
  ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
    ? [
        AzureAD({
          clientId: process.env.AZURE_AD_CLIENT_ID,
          clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
          tenantId: process.env.AZURE_AD_TENANT_ID,
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
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      const { registrationNumber, password } = parsed.data;

      const user = await prisma.user.findUnique({
        where: { registrationNumber },
      });
      if (!user || !user.passwordHash) return null;
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;
      return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined, image: user.image ?? undefined };
    },
  }),
];

const maybeAdapter = process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined;

export const authOptions = {
  // Make adapter optional for local/dev without DB
  adapter: maybeAdapter,
  session: { strategy: "jwt" as const },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "insecure-dev-secret-change-me" : undefined),
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user && (user as { id?: string }).id) {
        token.id = (user as { id: string }).id;
      }
      if (token?.id) {
        const u = await prisma.user.findUnique({ where: { id: token.id as string }, select: { registrationNumber: true } });
        token.registrationNumber = u?.registrationNumber ?? null;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token?.id) {
        // Ensure session.user exists
        session.user = { ...session.user, id: token.id as string };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).registrationNumber = token.registrationNumber ?? null;
      return session;
    },
  },
};

export const getAuth = async () => {
  const session = await unstable_getServerSession(authOptions);
  return session as (Session & { registrationNumber?: string | null }) | null;
};
