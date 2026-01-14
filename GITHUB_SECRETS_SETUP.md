# GitHub Secrets Setup Guide

To enable automatic deployment to Vercel, you need to add the following secrets to your GitHub repository.

## Steps to Add Secrets

1. Go to your GitHub repository: https://github.com/igortom-beta/lojzovypaseky
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each secret below

## Required Secrets

### 1. OPENAI_API_KEY
- **Value**: Get from https://platform.openai.com/account/api-keys
- **Description**: OpenAI API key for GPT-4o integration

### 2. VERCEL_TOKEN
- **Value**: Get from https://vercel.com/account/tokens
- **Description**: Vercel authentication token for deployment

### 3. VERCEL_ORG_ID
- **Value**: Get from Vercel project settings
- **Description**: Your Vercel organization ID

### 4. VERCEL_PROJECT_ID
- **Value**: Get from Vercel project settings
- **Description**: Your Vercel project ID

### 5. DATABASE_URL (Optional)
- **Value**: `mysql://user:password@host:3306/database`
- **Description**: Database connection string (if using chat history)

### 6. JWT_SECRET (Optional)
- **Value**: Generate a random string (e.g., `openssl rand -base64 32`)
- **Description**: Secret for JWT token signing

## How to Get Vercel Credentials

1. Go to https://vercel.com/account/tokens
2. Create a new token (copy it)
3. Go to your Vercel project settings
4. Find **Project ID** and **Team ID** (Organization ID)

## Automatic Deployment

Once secrets are added, every push to `main` branch will:
1. Run tests
2. Build the project
3. Deploy to Vercel
4. Update lojzovypaseky.life

## Troubleshooting

- **Deployment fails**: Check GitHub Actions logs for errors
- **API key not working**: Verify OpenAI API key is valid and has credits
- **Build errors**: Run `pnpm install && pnpm build` locally to debug

## Manual Deployment

If automatic deployment doesn't work:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

---

**Last Updated**: January 2026
