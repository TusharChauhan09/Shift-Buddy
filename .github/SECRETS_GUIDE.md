# How to Add GitHub Secrets - Step by Step Guide

## ⚠️ Important: GitHub Secrets vs .env.local

**Critical Distinction:**

- **Your `.env.local` file** (for local development): Uses `GITHUB_ID` and `GITHUB_SECRET`
- **GitHub repository secrets** (for CI/CD workflows): Use `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`

**Why the difference?**
GitHub Actions **reserves all secrets starting with `GITHUB_`**. So we:

1. Store secrets in GitHub as `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`
2. Workflows map them to environment variables: `AUTH_GITHUB_ID` → `GITHUB_ID` for the app
3. Your NextAuth configuration still uses `GITHUB_ID` - no code changes needed!

**In summary:**

- ✅ `.env.local`: `GITHUB_ID=...` and `GITHUB_SECRET=...` (correct, don't change)
- ✅ GitHub Secrets: `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` (to avoid reserved prefix)
- ✅ The workflows automatically handle the mapping

---

## 📍 Where to Add Secrets

GitHub Secrets are stored in your repository settings. Here's exactly where to find them:

### Step-by-Step Instructions

#### 1. Navigate to Your Repository

- Go to: `https://github.com/TusharChauhan09/Dev-Arena`
- You should see your repository homepage

#### 2. Open Settings

- Click on the **"Settings"** tab (top right of your repository)
- ⚠️ Note: You must be the repository owner or have admin access

#### 3. Navigate to Secrets

- In the left sidebar, scroll down to **"Security"** section
- Click on **"Secrets and variables"**
- Click on **"Actions"**

**Full Path:** `Settings → Secrets and variables → Actions`

#### 4. Add a New Secret

- Click the green **"New repository secret"** button (top right)
- You'll see a form with two fields:
  - **Name**: The secret name (must match exactly what's in workflows)
  - **Secret**: The actual value (will be hidden after saving)

---

## 🔐 Secrets You Need to Add

### For Your Dev-Arena Project

Here's the complete list with exact names and what values to use:

### 1. Database Secret

| Name           | Value                             | Where to Get It          |
| -------------- | --------------------------------- | ------------------------ |
| `DATABASE_URL` | Your PostgreSQL connection string | From Neon.tech dashboard |

**Example value:**

```
postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

---

### 2. NextAuth Secrets

| Name              | Value                       | Where to Get It                                              |
| ----------------- | --------------------------- | ------------------------------------------------------------ |
| `NEXTAUTH_SECRET` | Random 32+ character string | Generate with command below                                  |
| `NEXTAUTH_URL`    | Your production URL         | Your deployed app URL or `http://localhost:3000` for testing |

**Generate NEXTAUTH_SECRET:**

```bash
# In PowerShell:
-join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or visit: https://generate-secret.vercel.app/32
```

**Example values:**

```
NEXTAUTH_SECRET=abc123xyz789randomstring32chars
NEXTAUTH_URL=https://dev-arena.vercel.app
```

---

### 3. GitHub OAuth (for GitHub login)

| Name                 | Value                   | Where to Get It           |
| -------------------- | ----------------------- | ------------------------- |
| `AUTH_GITHUB_ID`     | OAuth App Client ID     | GitHub Developer Settings |
| `AUTH_GITHUB_SECRET` | OAuth App Client Secret | GitHub Developer Settings |

**Note:** We use `AUTH_GITHUB_ID` instead of `GITHUB_ID` because GitHub Actions reserves secrets starting with `GITHUB_`

**How to get GitHub OAuth credentials:**

1. Go to: `https://github.com/settings/developers`
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in:
   - Application name: `Dev-Arena`
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. After creating, copy **Client ID** and generate **Client Secret**

---

### 4. Google OAuth (for Google login)

| Name                   | Value                   | Where to Get It      |
| ---------------------- | ----------------------- | -------------------- |
| `GOOGLE_CLIENT_ID`     | OAuth 2.0 Client ID     | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | Google Cloud Console |

**How to get Google OAuth credentials:**

1. Go to: `https://console.cloud.google.com`
2. Create a new project or select existing
3. Navigate to **"APIs & Services"** → **"Credentials"**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Configure consent screen if prompted
6. Select **"Web application"**
7. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
8. Copy **Client ID** and **Client Secret**

---

### 5. Azure AD OAuth (for Microsoft login)

| Name                     | Value                   | Where to Get It                |
| ------------------------ | ----------------------- | ------------------------------ |
| `AZURE_AD_CLIENT_ID`     | Application (client) ID | Azure Portal                   |
| `AZURE_AD_CLIENT_SECRET` | Client Secret Value     | Azure Portal                   |
| `AZURE_AD_TENANT_ID`     | Directory (tenant) ID   | Azure Portal (or use `common`) |

**How to get Azure AD credentials:**

1. Go to: `https://portal.azure.com`
2. Navigate to **"Azure Active Directory"** → **"App registrations"**
3. Click **"New registration"**
4. Fill in:
   - Name: `Dev-Arena`
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
5. After creating:
   - Copy **Application (client) ID** → This is `AZURE_AD_CLIENT_ID`
   - Copy **Directory (tenant) ID** → This is `AZURE_AD_TENANT_ID`
   - Go to **"Certificates & secrets"** → **"New client secret"**
   - Copy the **Value** (not ID!) → This is `AZURE_AD_CLIENT_SECRET`

**Note:** For multi-tenant, use `AZURE_AD_TENANT_ID=common`

---

### 6. Vercel Deployment Secrets (Optional - for auto-deploy)

| Name                | Value               | Where to Get It             |
| ------------------- | ------------------- | --------------------------- |
| `VERCEL_TOKEN`      | Vercel Access Token | Vercel Account Settings     |
| `VERCEL_ORG_ID`     | Organization ID     | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project ID          | From `.vercel/project.json` |

**How to get Vercel credentials:**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel login`
3. Run: `vercel link` (in your project directory)
4. This creates `.vercel/project.json` with your IDs
5. For token: Go to `https://vercel.com/account/tokens` → Create new token

---

## 📋 Quick Checklist

Copy this checklist and check off as you add each secret:

```
Essential Secrets (Required):
☐ DATABASE_URL
☐ NEXTAUTH_SECRET
☐ NEXTAUTH_URL

OAuth Secrets (At least one required):
☐ AUTH_GITHUB_ID
☐ AUTH_GITHUB_SECRET
☐ GOOGLE_CLIENT_ID
☐ GOOGLE_CLIENT_SECRET
☐ AZURE_AD_CLIENT_ID
☐ AZURE_AD_CLIENT_SECRET
☐ AZURE_AD_TENANT_ID

Deployment Secrets (Optional):
☐ VERCEL_TOKEN
☐ VERCEL_ORG_ID
☐ VERCEL_PROJECT_ID
```

---

## 🎯 Adding a Secret - Detailed Example

Let's add `DATABASE_URL` as an example:

### Step 1: Copy Your Value

From your `.env` file or Neon.tech dashboard:

```
postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb
```

### Step 2: Go to Secrets Page

- Visit: `https://github.com/TusharChauhan09/Dev-Arena/settings/secrets/actions`
- Click **"New repository secret"**

### Step 3: Fill the Form

- **Name:** `DATABASE_URL` (exactly as shown, case-sensitive!)
- **Secret:** Paste your connection string
- Click **"Add secret"**

### Step 4: Verify

- You should see `DATABASE_URL` in the secrets list
- The value will be hidden (shows as `***`)
- ✅ Secret added successfully!

### Step 5: Repeat for All Secrets

Follow the same process for each secret from the checklist above.

---

## ⚠️ Important Notes

### Security Best Practices

- ✅ **Never commit secrets to git** - They're in `.env` which is gitignored
- ✅ **Different values for production** - Use production URLs/credentials for GitHub secrets
- ✅ **Rotate secrets regularly** - Change passwords/tokens periodically
- ✅ **Use different secrets for dev/prod** - Don't use production DB in development

### Common Mistakes

- ❌ Using local URLs in production secrets (use actual domain)
- ❌ Adding extra spaces in secret values (copy carefully)
- ❌ Wrong secret names (must match exactly, including case)
- ❌ Using development credentials in production

### Testing Secrets

After adding secrets, test them:

1. Push your code with workflows
2. Go to **Actions** tab
3. Check if workflows run successfully
4. If they fail, check the logs for "secret not found" errors

---

## 🔄 Updating Secrets

To update an existing secret:

1. Go to the secrets page: `Settings → Secrets and variables → Actions`
2. Find the secret in the list
3. Click **"Update"** button next to it
4. Enter the new value
5. Click **"Update secret"**

---

## 🆘 Troubleshooting

### "Workflow not running"

- Check if Actions are enabled: `Settings → Actions → General`
- Ensure workflows are in `.github/workflows/` directory

### "Secret not found in workflow"

- Verify secret name matches exactly (case-sensitive)
- Check spelling in workflow files
- Make sure secret is added at repository level (not environment level)

### "Authentication failed"

- Check OAuth redirect URIs match exactly
- Verify credentials are for the correct environment
- Test credentials manually before adding to secrets

### "Database connection failed"

- Verify DATABASE_URL format is correct
- Check if database allows connections from GitHub Actions IPs
- Neon.tech should work without IP restrictions

---

## 📞 Need Help?

If you encounter issues:

1. Check workflow logs in **Actions** tab for detailed errors
2. Verify all secrets are added with correct names
3. Test OAuth providers locally first
4. Check `.env.example` for reference format

---

## 🎉 Quick Start Commands

After adding all secrets, test your setup:

```bash
# 1. Commit and push workflow files
git add .github
git commit -m "feat: Add GitHub Actions workflows"
git push origin main

# 2. Check Actions tab
# Visit: https://github.com/TusharChauhan09/Dev-Arena/actions

# 3. Watch workflows run
# All should pass with green checkmarks ✅
```

---

**Direct Link to Add Secrets:**
`https://github.com/TusharChauhan09/Dev-Arena/settings/secrets/actions/new`

**Pro Tip:** Bookmark this link for quick access! 🔖
