Auth setup quickstart

1) Environment variables
- Copy .env.example to .env and fill the values.
- For dev, set NEXTAUTH_URL=http://localhost:3000 and set a strong NEXTAUTH_SECRET.
- GitHub OAuth: set GITHUB_ID, GITHUB_SECRET. Callback URL = {NEXTAUTH_URL}/api/auth/callback/github
- Microsoft Entra ID: set AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID (or "common"). Redirect URI = {NEXTAUTH_URL}/api/auth/callback/azure-ad

2) Database and Prisma
- Set DATABASE_URL
- Run: npx prisma migrate dev --name init && npx prisma generate

3) Run the app
- npm run dev
- Visit /auth/signin and test providers.

Troubleshooting
- 401 on callback: confirm NEXTAUTH_URL matches your actual origin and callback URLs exactly.
- Azure AD: if multi-tenant, use AZURE_AD_TENANT_ID=common; otherwise your tenant guid.
- GitHub: ensure Authorization callback URL matches exactly.
