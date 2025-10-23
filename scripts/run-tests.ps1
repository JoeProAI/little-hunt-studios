# PowerShell script to run model tests with Firebase integration
# Usage: .\scripts\run-tests.ps1

Write-Host "🚀 Starting Model Test Suite with Firebase Integration" -ForegroundColor Cyan
Write-Host ""

# Check for required environment variables
if (-not $env:REPLICATE_API_TOKEN) {
    Write-Host "❌ Error: REPLICATE_API_TOKEN not set" -ForegroundColor Red
    Write-Host "Please set it in your .env.local file" -ForegroundColor Yellow
    exit 1
}

if (-not $env:FIREBASE_PRIVATE_KEY) {
    Write-Host "❌ Error: Firebase Admin credentials not set" -ForegroundColor Red
    Write-Host "Please set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env.local" -ForegroundColor Yellow
    exit 1
}

# Get user ID from command line or prompt
$userId = $args[0]
if (-not $userId) {
    Write-Host "Enter your Firebase User ID:" -ForegroundColor Yellow
    $userId = Read-Host
}

if (-not $userId) {
    Write-Host "❌ Error: User ID is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Configuration:" -ForegroundColor Green
Write-Host "   User ID: $userId"
Write-Host "   Models to test: 26"
Write-Host "   Estimated time: 1-2 hours"
Write-Host "   Estimated cost: $10-15"
Write-Host ""

# Confirm before proceeding
Write-Host "⚠️  This will use Replicate credits. Continue? (y/n)" -ForegroundColor Yellow
$confirm = Read-Host
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🏃 Running tests..." -ForegroundColor Green
Write-Host ""

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Run the test suite
npm run test:models -- --userId=$userId

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Tests completed successfully!" -ForegroundColor Green
    Write-Host "📊 Check test-results-*.json for detailed results" -ForegroundColor Cyan
    Write-Host "💾 Demo videos saved to Firebase" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Tests failed with errors" -ForegroundColor Red
    exit 1
}
