#!/bin/bash
# Vercel deployment script

echo "🚀 Setting up Vercel deployment..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔑 Login to Vercel..."
vercel login

echo ""
echo "🚀 Deploying to Vercel..."
vercel

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Add environment variable OPENAI_API_KEY in Vercel dashboard"
echo "2. Run: vercel --prod (to deploy to production)"
echo ""
echo "📚 See DEPLOYMENT.md for more details"
