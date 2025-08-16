# Simple Startup Script for CryptoCandle AI
Write-Host "🚀 Starting CryptoCandle AI Project..." -ForegroundColor Green
Write-Host ""

# Step 1: Start Backend
Write-Host "🔧 Step 1: Starting Backend Server..." -ForegroundColor Cyan
Write-Host "Opening new PowerShell window for backend..." -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\fine\newcryptocandless-ai\server'; Write-Host 'Installing dependencies...' -ForegroundColor Yellow; npm install; Write-Host 'Starting server...' -ForegroundColor Green; npm start"

# Wait a moment
Start-Sleep -Seconds 5

# Step 2: Start Frontend
Write-Host "🌐 Step 2: Starting Frontend Client..." -ForegroundColor Cyan
Write-Host "Opening new PowerShell window for frontend..." -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\fine\newcryptocandless-ai\client'; Write-Host 'Installing dependencies...' -ForegroundColor Yellow; npm install; Write-Host 'Starting client...' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "🎉 Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🖥️  Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait for both to finish starting..." -ForegroundColor Yellow
Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to exit this script..."
Read-Host


