@echo off
echo 🚀 Testing CryptoCandle AI Project...
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

echo.
echo 🔧 Starting server...
cd server
npm start


