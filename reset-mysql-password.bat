@echo off
echo ========================================
echo MySQL Password Reset Guide
echo ========================================
echo.
echo BUOC 1: Stop MySQL Service
echo Run as Administrator:
echo   net stop MySQL80
echo.
echo BUOC 2: Create init file
echo Copy this to C:\mysql-init.txt:
echo   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
echo.
echo BUOC 3: Start MySQL with init file
echo Run:
echo   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --init-file=C:\mysql-init.txt --console
echo.
echo BUOC 4: Stop the console (Ctrl+C) and restart MySQL normally:
echo   net start MySQL80
echo.
echo BUOC 5: Login with new password:
echo   mysql -u root -p
echo.
echo ========================================
echo OR USE MYSQL WORKBENCH (Easier):
echo 1. Open MySQL Workbench
echo 2. Check saved connections
echo 3. Password may be saved there
echo ========================================
pause
