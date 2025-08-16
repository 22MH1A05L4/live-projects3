# Test for Errors in CryptoCandle AI Project
Write-Host "🔍 Testing for Errors in CryptoCandle AI Project..." -ForegroundColor Green
Write-Host ""

# Check Node.js installation
Write-Host "📋 Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js or npm not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check project structure
Write-Host "📁 Checking project structure..." -ForegroundColor Cyan
$requiredFiles = @(
    "server\server.js",
    "server\config.js", 
    "server\package.json",
    "server\routes\stocks.js",
    "server\routes\crypto.js",
    "client\package.json",
    "client\src\App.tsx",
    "client\src\components\Chart.tsx",
    "client\src\components\index.ts"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - MISSING!" -ForegroundColor Red
    }
}

Write-Host ""

# Check for duplicate routes
Write-Host "🔍 Checking for duplicate routes..." -ForegroundColor Cyan
$stocksContent = Get-Content "server\routes\stocks.js" -Raw
$cryptoContent = Get-Content "server\routes\crypto.js" -Raw

$stocksPopularCount = ([regex]::Matches($stocksContent, "router\.get\('/popular'")).Count
$cryptoPopularCount = ([regex]::Matches($cryptoContent, "router\.get\('/popular'")).Count

if ($stocksPopularCount -eq 1) {
    Write-Host "✅ stocks.js: 1 /popular route" -ForegroundColor Green
} else {
    Write-Host "❌ stocks.js: $stocksPopularCount /popular routes (should be 1)" -ForegroundColor Red
}

if ($cryptoPopularCount -eq 1) {
    Write-Host "✅ crypto.js: 1 /popular route" -ForegroundColor Green
} else {
    Write-Host "❌ crypto.js: $cryptoPopularCount /popular routes (should be 1)" -ForegroundColor Red
}

Write-Host ""

# Check package.json files
Write-Host "📦 Checking package.json files..." -ForegroundColor Cyan
try {
    $serverPackage = Get-Content "server\package.json" | ConvertFrom-Json
    if ($serverPackage.main -eq "server.js") {
        Write-Host "✅ server/package.json main field correct" -ForegroundColor Green
    } else {
        Write-Host "❌ server/package.json main field should be 'server.js'" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error reading server package.json" -ForegroundColor Red
}

try {
    $clientPackage = Get-Content "client\package.json" | ConvertFrom-Json
    if ($clientPackage.dependencies.lightweight-charts) {
        Write-Host "✅ client/package.json has lightweight-charts" -ForegroundColor Green
    } else {
        Write-Host "❌ client/package.json missing lightweight-charts" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error reading client package.json" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Error check complete!" -ForegroundColor Green
Write-Host "If you see any ❌ errors above, they need to be fixed." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to continue..."
Read-Host


