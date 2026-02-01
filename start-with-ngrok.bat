@echo off
echo ================================================
echo  Milk Bank System - Development with ngrok
echo ================================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok not found! Please install from https://ngrok.com/download
    pause
    exit /b 1
)

REM Start backend
echo [1/4] Starting Backend...
start "Backend API" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 5 >nul

REM Start frontend
echo [2/4] Starting Frontend...
start "Frontend Dev" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5 >nul

REM Instructions
echo.
echo ================================================
echo ✅ Services started successfully!
echo ================================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo To share via ngrok, open 2 new terminals:
echo.
echo Terminal 1 (Backend):
echo   ngrok http 5001
echo.
echo Terminal 2 (Frontend):
echo   ngrok http 3000
echo.
echo Then update frontend/.env.local with backend ngrok URL:
echo   VITE_BACKEND_URL=https://your-ngrok-backend-url.ngrok-free.app
echo.
echo After updating, restart frontend (Ctrl+C and npm run dev again)
echo ================================================
pause
