# GitHub Workflows Documentation

This directory contains GitHub Actions workflows for the Dev-Arena project (Hostel Swap System).

## 📋 Overview

The project uses multiple workflows to ensure code quality, security, and smooth deployments.

## 🔄 Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Trigger:** Push/PR to `main` or `develop` branches

**Jobs:**

- **Lint & Type Check**: Runs ESLint and TypeScript compilation
- **Build**: Builds the Next.js application
- **Database Validation**: Validates Prisma schema and tests migrations
- **Security Audit**: Checks for vulnerabilities in dependencies
- **Deployment Status**: Reports when all checks pass

**Purpose:** Ensures code quality and build success before merging

---

### 2. Deployment (`deploy.yml`)

**Trigger:** Push to `main` branch or manual dispatch

**Jobs:**

- Runs database migrations
- Builds production application
- Deploys to Vercel
- Sends success/failure notifications

**Purpose:** Automated production deployment

**Required Secrets:**

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth encryption secret
- `NEXTAUTH_URL` - Production URL
- `GITHUB_ID` / `GITHUB_SECRET` - GitHub OAuth credentials
- `AZURE_AD_CLIENT_ID` / `AZURE_AD_CLIENT_SECRET` / `AZURE_AD_TENANT_ID` - Azure AD OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

---

### 3. Pull Request Checks (`pr-checks.yml`)

**Trigger:** Pull request opened/updated

**Jobs:**

- **PR Validation**: Validates PR title format (conventional commits)
- **Test & Build**: Runs full test suite and build
- **Merge Conflict Check**: Detects merge conflicts
- **Bundle Size**: Analyzes build output size

**Purpose:** Automated PR review and validation

**Supported PR Title Formats:**

- `feat: Add new feature`
- `fix: Bug fix`
- `docs: Documentation update`
- `style: Code style changes`
- `refactor: Code refactoring`
- `perf: Performance improvements`
- `test: Test updates`
- `chore: Maintenance tasks`

---

### 4. Dependency Updates (`dependencies.yml`)

**Trigger:** Weekly (Monday 9 AM UTC) or manual dispatch

**Jobs:**

- **Update Dependencies**: Checks for outdated packages
- **Security Audit**: Scans for vulnerabilities

**Purpose:** Keeps dependencies up-to-date and secure

**Auto-creates Issues for:**

- Outdated dependencies (with version comparison table)
- Security vulnerabilities (with severity breakdown)

---

### 5. Database Migration (`database-migration.yml`)

**Trigger:** Manual dispatch only

**Jobs:**

- **Migrate**: Runs Prisma migrations on selected environment
- **Backup Check**: Verifies backup status (production only)

**Purpose:** Controlled database schema updates

**Inputs:**

- `environment`: Choose from development/staging/production
- `migration_name`: Optional migration identifier

**Safety Features:**

- Environment-specific execution
- Migration status check before running
- Post-migration verification issue creation
- Backup reminder for production

---

## 🔐 Required GitHub Secrets

### Essential Secrets

```
DATABASE_URL                 # PostgreSQL connection string (Neon)
NEXTAUTH_SECRET             # Random string for NextAuth encryption
NEXTAUTH_URL                # Application URL
```

### OAuth Providers

```
GITHUB_ID                   # GitHub OAuth App ID
GITHUB_SECRET               # GitHub OAuth App Secret
AZURE_AD_CLIENT_ID          # Azure AD App ID
AZURE_AD_CLIENT_SECRET      # Azure AD App Secret
AZURE_AD_TENANT_ID          # Azure AD Tenant (usually "common")
GOOGLE_CLIENT_ID            # Google OAuth Client ID
GOOGLE_CLIENT_SECRET        # Google OAuth Client Secret
```

### Deployment (Vercel)

```
VERCEL_TOKEN                # Vercel deployment token
VERCEL_ORG_ID              # Vercel organization ID
VERCEL_PROJECT_ID          # Vercel project ID
```

---

## 🚀 Setup Instructions

### 1. Add Secrets to GitHub

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret from the list above

### 2. Configure Environments (Optional)

For `database-migration.yml` to work with environment-specific secrets:

1. Go to **Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. Add environment-specific secrets (e.g., different `DATABASE_URL` for each)

### 3. Vercel Setup (For Deployment)

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Get tokens: `vercel token`
4. Get IDs from `.vercel/project.json`

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI/CD](https://github.com/TusharChauhan09/Dev-Arena/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/TusharChauhan09/Dev-Arena/actions/workflows/deploy.yml/badge.svg)
![PR Checks](https://github.com/TusharChauhan09/Dev-Arena/actions/workflows/pr-checks.yml/badge.svg)
```

---

## 🛠️ Manual Workflow Triggers

### Deploy to Production

```bash
# Via GitHub UI: Actions → Deploy to Production → Run workflow
```

### Run Database Migration

```bash
# Via GitHub UI: Actions → Database Migration → Run workflow
# Select environment and optionally provide migration name
```

### Check Dependencies

```bash
# Via GitHub UI: Actions → Dependency Updates → Run workflow
```

---

## 📝 Best Practices

### For Developers

1. **Always create feature branches** from `develop`
2. **Write conventional commit messages** for PR auto-validation
3. **Test locally** before pushing to avoid CI failures
4. **Review workflow logs** when checks fail

### For Maintainers

1. **Review dependency issues** weekly
2. **Update secrets** when credentials rotate
3. **Monitor security audit** results
4. **Keep workflows updated** with latest action versions

### For Deployments

1. **Merge to develop** first for staging deployment
2. **Merge to main** only after staging verification
3. **Run database migrations** before code deployment if schema changes
4. **Always backup production database** before migrations

---

## 🐛 Troubleshooting

### Build Failures

**Issue:** Build fails with Prisma errors
**Solution:** Ensure `DATABASE_URL` is set in secrets and Prisma schema is valid

**Issue:** Type check errors
**Solution:** Run `npm run build` locally to catch TypeScript errors

### Deployment Failures

**Issue:** Vercel deployment fails
**Solution:** Verify all Vercel secrets are correct and project is linked

**Issue:** Database connection fails
**Solution:** Check if `DATABASE_URL` is accessible from Vercel's network

### Migration Issues

**Issue:** Migration fails in production
**Solution:** Check migration status with `npx prisma migrate status` and resolve conflicts

---

## 📞 Support

For workflow issues:

1. Check the **Actions** tab for detailed logs
2. Review the **Issues** section for auto-created dependency/security alerts
3. Contact repository maintainers for secret-related problems

---

## 🔄 Updating Workflows

When updating workflows:

1. Test in a feature branch first
2. Monitor the first run carefully
3. Update this documentation accordingly
4. Consider backward compatibility

---

**Last Updated:** January 2025
**Project:** Dev-Arena (Hostel Swap System)
**Framework:** Next.js 15.5.0 with Prisma & NextAuth
