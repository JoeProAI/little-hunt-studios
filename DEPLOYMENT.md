# Deployment Guide - Little Hunt Studios

**Hunt the Perfect Frame with AI** 🎯

This guide walks you through deploying Little Hunt Studios to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- OpenAI API key with Sora 2 access
- Git installed on your machine

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository

```bash
cd "c:/Projects/The Machine/Sora the Explora/little-hunt-studios"
git init
git add .
git commit -m "Initial commit: Little Hunt Studios"
```

### 1.2 Create GitHub Repository

**Option A: Using GitHub CLI**
```bash
# Install GitHub CLI if needed: https://cli.github.com/
gh auth login
gh repo create little-hunt-studios --public --source=. --remote=origin --push
```

**Option B: Using GitHub Web Interface**
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `little-hunt-studios`
3. Description: "Little Hunt Studios - Hunt the Perfect Frame with AI"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

Then connect your local repo:
```bash
git remote add origin https://github.com/YOUR_USERNAME/little-hunt-studios.git
git branch -M main
git push -u origin main
```

### 1.3 Add GitHub Secrets (Optional - for CI/CD)

1. Go to your repository on GitHub
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

## Step 2: Deploy to Vercel

### Method 1: Vercel Web Dashboard (Recommended)

#### 2.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. If not connected, authorize Vercel to access your GitHub account
4. Select your `little-hunt-studios` repository
5. Click "Import"

#### 2.2 Configure Project

Vercel will auto-detect Next.js. Configure:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### 2.3 Add Environment Variables

In the "Environment Variables" section, add:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` (update after deployment) |

⚠️ **IMPORTANT**: Make sure `OPENAI_API_KEY` does NOT have the "Expose to preview deployments" checkbox enabled (for security).

#### 2.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-project.vercel.app`

#### 2.5 Update App URL

After first deployment:
1. Copy your deployment URL
2. Go to "Settings" > "Environment Variables"
3. Update `NEXT_PUBLIC_APP_URL` to your actual URL
4. Redeploy from "Deployments" tab

### Method 2: Vercel CLI

#### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 2.2 Login

```bash
vercel login
```

#### 2.3 Deploy

```bash
cd "c:/Projects/The Machine/Sora the Explora/sora2-epic-studio"
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- What's your project's name? `sora2-epic-studio`
- In which directory is your code located? `./`
- Want to override settings? **N**

#### 2.4 Add Environment Variables

```bash
vercel env add OPENAI_API_KEY production
# Paste your API key when prompted

vercel env add NEXT_PUBLIC_APP_URL production
# Enter your Vercel URL
```

#### 2.5 Deploy to Production

```bash
vercel --prod
```

## Step 3: Post-Deployment Setup

### 3.1 Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 3.2 Enable Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Open Pull Request → Preview deployment with unique URL

### 3.3 Test Your Deployment

1. Visit your deployment URL
2. Navigate through all tabs:
   - ✅ Prompt Builder
   - ✅ Style Presets (16 presets should load)
   - ✅ Shot Library (45 shots should load)
   - ✅ Generate tab
3. Test video generation (requires OpenAI API access)

## Step 4: Monitoring & Management

### View Deployment Logs

**Vercel Dashboard:**
1. Go to your project
2. Click "Deployments"
3. Select a deployment
4. View "Build Logs" and "Function Logs"

**Vercel CLI:**
```bash
vercel logs
```

### Redeploy

**Automatic:**
```bash
git add .
git commit -m "Update feature"
git push origin main
```

**Manual (Vercel Dashboard):**
1. Go to "Deployments"
2. Click "..." on any deployment
3. Click "Redeploy"

### Rollback

1. Go to "Deployments"
2. Find a previous successful deployment
3. Click "..." > "Promote to Production"

## Troubleshooting

### Build Fails

**Check Node Version:**
Vercel uses Node 18.x by default. Ensure compatibility in `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Missing Dependencies:**
```bash
# Clear lockfile and reinstall
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### API Errors

**Environment Variables Not Set:**
1. Verify in Vercel Dashboard > Settings > Environment Variables
2. Ensure `OPENAI_API_KEY` is set
3. Redeploy after adding variables

**CORS Issues:**
Update `next.config.js` if needed:
```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

### Data Files Not Loading

Ensure JSON files are in correct location:
```
src/data/
├── prompt_recipes.json
├── style_presets.json
└── shot_library.json
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key with Sora 2 access | `sk-proj-...` |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Recommended | Your app's URL | `https://sora-studio.vercel.app` |

## Performance Optimization

### Edge Functions

API routes are automatically deployed as serverless functions. For better performance:

1. **Enable Edge Runtime** (for certain routes):
```typescript
export const runtime = 'edge';
```

2. **Optimize Images**:
- Already configured in `next.config.js`
- Use Next.js `<Image>` component

3. **Enable Caching**:
```typescript
export const revalidate = 3600; // Cache for 1 hour
```

## Security Checklist

- ✅ API keys stored in environment variables
- ✅ No secrets in client-side code
- ✅ All API calls server-side
- ✅ `.env.local` in `.gitignore`
- ✅ HTTPS enforced by Vercel
- ✅ Environment variables not exposed to preview deployments

## Continuous Deployment

Every push to GitHub triggers automatic deployment:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Installs dependencies
# 3. Runs build
# 4. Deploys to production
# 5. Notifies you of success/failure
```

## Quick Commands Reference

```bash
# Push to GitHub
git add .
git commit -m "Your message"
git push origin main

# Deploy to Vercel
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls

# Open project in browser
vercel open
```

## Next Steps

1. ✅ Set up custom domain
2. ✅ Configure analytics (Vercel Analytics)
3. ✅ Enable Web Vitals monitoring
4. ✅ Set up error tracking (Sentry)
5. ✅ Add user authentication (NextAuth.js)
6. ✅ Implement rate limiting
7. ✅ Add database for project persistence

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Issues**: Report bugs in your repository

---

**Congratulations!** 🎉 Your Sora 2 Epic Video Studio is now live on the web!

Your deployment URL: `https://your-project.vercel.app`
