# GitHub Secrets - Quick Reference Card

## 🎯 Direct Link

**Add Secrets Here:** https://github.com/TusharChauhan09/Dev-Arena/settings/secrets/actions/new

## 📍 Navigation Path

```
GitHub Repository → Settings → Secrets and variables → Actions → New repository secret
```

## 📝 Complete Secrets List (Copy-Paste Names)

### Essential (Required)

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
```

### GitHub OAuth

```
AUTH_GITHUB_ID
AUTH_GITHUB_SECRET
```

### Google OAuth

```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Azure AD OAuth

```
AZURE_AD_CLIENT_ID
AZURE_AD_CLIENT_SECRET
AZURE_AD_TENANT_ID
```

### Vercel Deployment (Optional)

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## 🔧 Quick Value Examples

```bash
# DATABASE_URL (from Neon.tech)
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# NEXTAUTH_SECRET (generate random 32 chars)
abc123xyz789randomstring32chars

# NEXTAUTH_URL (your domain or localhost)
https://dev-arena.vercel.app
# OR for testing:
http://localhost:3000

# OAuth IDs/Secrets (alphanumeric strings from provider dashboards)
AUTH_GITHUB_ID=Iv1.abc123xyz789
AUTH_GITHUB_SECRET=ghp_abc123xyz789abc123xyz789abc123xyz789
```

## ⚡ Super Quick Setup

1. **Get your DATABASE_URL from Neon**

   - Go to: https://console.neon.tech
   - Copy connection string

2. **Generate NEXTAUTH_SECRET**

   - PowerShell: `-join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})`
   - Or: https://generate-secret.vercel.app/32

3. **Set NEXTAUTH_URL**

   - Production: Your actual domain
   - Testing: `http://localhost:3000`

4. **Setup OAuth (Choose at least one)**

   - **GitHub:** https://github.com/settings/developers
   - **Google:** https://console.cloud.google.com
   - **Azure:** https://portal.azure.com

5. **Add to GitHub**
   - Visit: https://github.com/TusharChauhan09/Dev-Arena/settings/secrets/actions
   - Click "New repository secret"
   - Add each secret one by one

## ✅ Verification Checklist

After adding secrets:

```
1. ☐ Go to Actions tab
2. ☐ Push any change to trigger workflows
3. ☐ Watch for green checkmarks ✅
4. ☐ If red ❌, check logs for missing secrets
```

## 🆘 Common Issues

**Secret not found:**

- Check exact spelling (case-sensitive)
- Verify it's repository secret, not environment secret

**OAuth fails:**

- Check redirect URIs match exactly
- Verify credentials are from correct environment

**Database fails:**

- Check connection string format
- Ensure `?sslmode=require` is included

## 🔗 Useful Links

- **Add Secrets:** https://github.com/TusharChauhan09/Dev-Arena/settings/secrets/actions
- **View Workflows:** https://github.com/TusharChauhan09/Dev-Arena/actions
- **GitHub OAuth:** https://github.com/settings/developers
- **Google Cloud:** https://console.cloud.google.com
- **Azure Portal:** https://portal.azure.com
- **Neon Console:** https://console.neon.tech
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**Need detailed instructions?** See `.github/SECRETS_GUIDE.md`
