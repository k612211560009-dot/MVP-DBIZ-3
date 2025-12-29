@echo off
echo Stopping processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul
echo Starting backend...
cd /d D:\dbiz\dbiz3\Mainweb\backend
node src/app.js
