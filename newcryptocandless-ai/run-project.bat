@echo off
echo 🚀 Starting CryptoCandle AI TradingView Platform
echo ===============================================

echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server npm install failed
    pause
    exit /b 1
)

echo 📦 Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client npm install failed
    pause
    exit /b 1
)

echo 🔧 Starting backend server...
cd ..\server
start "CryptoCandle Backend" cmd /k "npm start"

echo ⏳ Waiting 5 seconds for server to start...
timeout /t 5 /nobreak > nul

echo 🌐 Starting frontend client...
cd ..\client
start "CryptoCandle Frontend" cmd /k "npm start"

echo.
echo ✅ Both servers are starting!
echo 📊 Backend: http://localhost:5000
echo 🖥️ Frontend: http://localhost:3000
echo.
echo 🎯 Open http://localhost:3000 in your browser to see the TradingView platform!
echo.
pause
