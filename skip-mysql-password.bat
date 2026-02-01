@echo off
REM ========================================
REM Skip MySQL Password Check
REM RUN AS ADMINISTRATOR
REM ========================================

echo Stopping MySQL service...
net stop MySQL80

echo.
echo Starting MySQL without password check...
echo Press Ctrl+C when you see "Ready for connections"
echo.

cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --skip-grant-tables --shared-memory --console

REM In another terminal, run:
REM mysql -u root
REM USE mysql;
REM ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123!';
REM FLUSH PRIVILEGES;
REM EXIT;
REM
REM Then stop this console and run: net start MySQL80
