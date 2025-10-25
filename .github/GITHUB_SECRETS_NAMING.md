# GitHub Actions Secret Naming Fix

## 🔍 What Was Changed

### The Problem

GitHub Actions **reserves all secrets starting with `GITHUB_`** prefix. This caused an error:

```
Secret names must not start with GITHUB_.
```

### The Solution

We renamed the GitHub OAuth secrets in **GitHub repository secrets only**:

- `GITHUB_ID` → `AUTH_GITHUB_ID`
- `GITHUB_SECRET` → `AUTH_GITHUB_SECRET`

**Important:** Your `.env.local` file remains unchanged! It still uses `GITHUB_ID` and `GITHUB_SECRET`.

---

## 📁 Files Modified

### Workflow Files (2 files)

1. **`.github/workflows/ci.yml`**

   - Changed: `secrets.GITHUB_ID` → `secrets.AUTH_GITHUB_ID`
   - Changed: `secrets.GITHUB_SECRET` → `secrets.AUTH_GITHUB_SECRET`
   - Environment mapping: `AUTH_GITHUB_ID` secret → `GITHUB_ID` env variable

2. **`.github/workflows/deploy.yml`**
   - Same changes as ci.yml
   - Ensures consistent secret naming across workflows

### Documentation Files (3 files)

3. **`.github/SECRETS_GUIDE.md`**

   - Updated GitHub OAuth table with `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`
   - Updated OAuth secrets checklist
   - Added important note explaining the distinction between `.env.local` and GitHub secrets
   - Added explanation of why AUTH\_ prefix is needed

4. **`.github/SECRETS_QUICK_REF.md`**

   - Updated GitHub OAuth section
   - Updated example values
   - Quick reference now shows correct secret names

5. **`.github/WORKFLOWS_SETUP.md`**
   - Updated OAuth providers section
   - Added note about AUTH\_ prefix requirement

---

## 🔄 How It Works

### The Flow

```
GitHub Secrets (stored in GitHub)
    ↓
AUTH_GITHUB_ID = "your_client_id"
AUTH_GITHUB_SECRET = "your_client_secret"
    ↓
Workflow Environment Variables (during CI/CD)
    ↓
GITHUB_ID = ${{ secrets.AUTH_GITHUB_ID }}
GITHUB_SECRET = ${{ secrets.AUTH_GITHUB_SECRET }}
    ↓
Your NextAuth App (uses standard names)
    ↓
Uses GITHUB_ID and GITHUB_SECRET normally
```

### Example from ci.yml

```yaml
- name: Build application
  run: npm run build
  env:
    # The secret AUTH_GITHUB_ID is mapped to GITHUB_ID environment variable
    GITHUB_ID: ${{ secrets.AUTH_GITHUB_ID }}
    GITHUB_SECRET: ${{ secrets.AUTH_GITHUB_SECRET }}
```

### Your .env.local (unchanged)

```bash
# Your local development file - NO CHANGES NEEDED
GITHUB_ID=Iv1.your_client_id
GITHUB_SECRET=your_client_secret
```

---

## ✅ What You Need to Do

When adding secrets to GitHub:

### ❌ DON'T add these:

```
GITHUB_ID
GITHUB_SECRET
```

### ✅ DO add these instead:

```
AUTH_GITHUB_ID
AUTH_GITHUB_SECRET
```

### How to Add

1. Go to: `https://github.com/TusharChauhan09/Dev-Arena/settings/secrets/actions`
2. Click "New repository secret"
3. Add:
   - Name: `AUTH_GITHUB_ID`
   - Value: Your GitHub OAuth Client ID
4. Add another:
   - Name: `AUTH_GITHUB_SECRET`
   - Value: Your GitHub OAuth Client Secret

---

## 🎯 Quick Verification

After pushing these changes:

1. **Check Workflow Syntax**

   - Go to: Actions tab in GitHub
   - Look for green checkmarks ✅

2. **Verify Secret Names**

   - Go to: Settings → Secrets and variables → Actions
   - You should see `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`

3. **Test a Workflow**
   - Push any commit
   - Watch the workflow run
   - Check logs if there are any issues

---

## 💡 Why This Approach?

### Reserved Prefixes

GitHub Actions reserves these prefixes for secrets:

- `GITHUB_`
- `ACTIONS_`
- `RUNNER_`

### Best Practice

- ✅ Use descriptive prefixes like `AUTH_`, `API_`, `DB_`, etc.
- ✅ Keep your application code unchanged
- ✅ Map secrets to expected environment variable names in workflows

### Benefits

- ✅ No code changes in your Next.js application
- ✅ NextAuth configuration remains the same
- ✅ Only workflow files know about the AUTH\_ prefix
- ✅ Clear separation between GitHub secrets and app environment variables

---

## 📚 References

- [GitHub Actions: Environment Variables](https://docs.github.com/en/actions/learn-github-actions/variables)
- [GitHub Actions: Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Reserved Secret Names](https://docs.github.com/en/actions/security-guides/encrypted-secrets#naming-your-secrets)

---

## 🆘 Troubleshooting

### "Secret not found" error

- Make sure you added `AUTH_GITHUB_ID` not `GITHUB_ID` in GitHub secrets

### "GITHUB\_ prefix" error

- This means a workflow is still using the old `secrets.GITHUB_ID` syntax
- All workflows have been updated to use `secrets.AUTH_GITHUB_ID`

### Local development not working

- Your `.env.local` should use `GITHUB_ID` (without AUTH\_ prefix)
- The AUTH\_ prefix is only for GitHub repository secrets

---

**Last Updated:** 2024
**Status:** ✅ All files updated and verified
