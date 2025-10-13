# Little Hunt Studios - Quick Deploy

**Hunt the Perfect Frame with AI** 🎯

## 🚀 Fastest Way to Deploy

### Step 1: Push to GitHub (2 minutes)

```bash
# Navigate to project
cd "c:/Projects/The Machine/Sora the Explora/little-hunt-studios"

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Create repo and push (requires GitHub CLI)
gh repo create little-hunt-studios --public --source=. --remote=origin --push
```

**Don't have GitHub CLI?** 
1. Go to [github.com/new](https://github.com/new)
2. Create repo named `little-hunt-studios`
3. Run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/little-hunt-studios.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (3 minutes)

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import your GitHub repository**
   - Click "Import Git Repository"
   - Select `little-hunt-studios`
   - Click "Import"

3. **Add Environment Variable**
   - Click "Environment Variables"
   - Add: `OPENAI_API_KEY` = `your_openai_key_here`
   - Click "Deploy"

4. **Done!** 🎉
   - Wait 2-3 minutes for build
   - Your app is live at `https://your-project.vercel.app`

## 📋 Environment Variables Needed

Add these in Vercel Dashboard:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL | Optional |

## ✅ Post-Deployment Checklist

- [ ] Visit your deployment URL
- [ ] Test Prompt Builder
- [ ] Verify 16 Style Presets load
- [ ] Verify 45 Shots load in Shot Library
- [ ] Test video generation

## 🔄 Update Your App

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys! ✨
```

## 🆘 Troubleshooting

**Build fails?**
- Check `OPENAI_API_KEY` is set in Vercel Dashboard
- Go to Settings > Environment Variables

**Data not loading?**
- Files should be in `src/data/` directory
- Check deployment logs in Vercel

**Need help?**
- See full `DEPLOYMENT.md` guide
- Check Vercel deployment logs

## 📊 Your Stats

- ✅ Next.js 14 app
- ✅ 10 prompt templates
- ✅ 16 style presets  
- ✅ 45 camera shots
- ✅ Sora 2 integration
- ✅ GPT Image 1 integration

**Deployment URL**: Check Vercel dashboard for your URL!
