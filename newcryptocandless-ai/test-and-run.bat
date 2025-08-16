@echo off
echo 🚀 CryptoCandle AI - Complete Test & Run Script
echo ================================================
echo.

echo 📁 Checking project structure...
if exist "client\src\components\Chart.tsx" (
    echo ✅ Chart component found
) else (
    echo ❌ Chart component missing
)

if exist "client\src\components\AIAnalysisPanel.tsx" (
    echo ✅ AIAnalysisPanel component found
) else (
    echo ❌ AIAnalysisPanel component missing
)

if exist "server\routes\stocks.js" (
    echo ✅ Stocks route found
) else (
    echo ❌ Stocks route missing
)

if exist "server\config.js" (
    echo ✅ Config file found
) else (
    echo ❌ Config file missing
)

echo.
echo 🔧 Installing dependencies...
echo.

echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependencies installation failed
    pause
    exit /b 1
)
echo ✅ Server dependencies installed

echo.
echo 📦 Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client dependencies installation failed
    pause
    exit /b 1
)
echo ✅ Client dependencies installed

echo.
echo 🚀 Starting the application...
echo.

echo 🔧 Starting backend server on port 5000...
start "Backend Server" cmd /k "cd /d C:\fine\newcryptocandless-ai\server && npm start"

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 🌐 Starting frontend client on port 3000...
start "Frontend Client" cmd /k "cd /d C:\fine\newcryptocandless-ai\client && npm start"

echo.
echo 🎉 Application started successfully!
echo.
echo 📊 Backend: http://localhost:5000
echo 🖥️  Frontend: http://localhost:3000
echo.
echo 🔍 Test the application:
echo    1. Open http://localhost:3000
echo    2. Search for "AAPL" or "BTC"
echo    3. Click on result to see charts
echo    4. Click "Analyze" for AI insights
echo.
echo Press any key to exit...
pause > nul


