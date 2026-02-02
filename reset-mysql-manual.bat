@echo off
echo ========================================
echo MySQL Password Reset - Manual Method
echo RUN AS ADMINISTRATOR
echo ========================================
echo.

echo Stopping MySQL...
net stop MySQL80

echo.
echo Starting MySQL in safe mode (skip-grant-tables)...
echo.
echo IMPORTANT: Keep this window open!
echo Open a NEW terminal window and run: mysql -u root
echo Then run these commands:
echo   USE mysql;
echo   ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123!';
echo   FLUSH PRIVILEGES;
echo   EXIT;
echo.
echo After that, come back here and press Ctrl+C to stop.
echo.
pause

cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --skip-grant-tables --shared-memory --console
