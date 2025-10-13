# PowerShell deployment script for Windows
Write-Host "🚀 Little Hunt Studios - GitHub & Vercel Deployment" -ForegroundColor Cyan
Write-Host "Hunt the Perfect Frame with AI 🎯" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Sora 2 Epic Video Studio"
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create GitHub repository at: https://github.com/new" -ForegroundColor White
Write-Host "2. Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/little-hunt-studios.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Go to https://vercel.com/new" -ForegroundColor Yellow
Write-Host "   - Import your GitHub repository" -ForegroundColor Yellow
Write-Host "   - Add OPENAI_API_KEY environment variable" -ForegroundColor Yellow
Write-Host "   - Click Deploy" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 See QUICK_DEPLOY.md for detailed instructions" -ForegroundColor Cyan
