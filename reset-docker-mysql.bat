@echo off
echo ========================================
echo Reset MySQL Docker Password
echo ========================================
echo.
echo Step 1: Stop containers...
docker-compose down

echo.
echo Step 2: Remove old volume (WARNING: WILL DELETE DATA!)
set /p confirm="Delete all MySQL data? (yes/no): "
if /i "%confirm%"=="yes" (
    docker volume rm mainweb_db_data
    echo Volume deleted!
) else (
    echo Keeping existing data...
)

echo.
echo Step 3: Start with fresh database...
docker-compose up -d

echo.
echo ========================================
echo MySQL Credentials:
echo ========================================
echo Host: localhost
echo Port: 3306
echo Root Password: change_me_root
echo.
echo Database: milkbank_dev
echo User: milkbank
echo Password: milkbank_pass
echo ========================================
echo.
echo Waiting for MySQL to start (15 seconds)...
timeout /t 15

echo.
echo Try connecting with MySQL Workbench:
echo   Host: localhost:3306
echo   User: root or milkbank
echo   Password: (see above)
echo.
pause
