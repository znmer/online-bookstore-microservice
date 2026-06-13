@echo off
chcp 65001 >nul
echo ========================================
echo  Installing Erlang OTP 28.5 ...
echo ========================================
echo.
echo  Please click YES on any UAC prompts
echo.
start /wait "" "D:\Projects\bookstore\infra\otp_win64_28.5.exe" /S
echo.
echo ========================================
echo  Erlang installed! Installing RabbitMQ...
echo ========================================
start /wait "" "D:\Projects\bookstore\infra\rabbitmq-server-4.3.1.exe" /S
echo.
echo ========================================
echo  Installation complete!
echo  Enabling RabbitMQ Management Plugin...
echo ========================================
for /d %%i in ("C:\Program Files\RabbitMQ Server\rabbitmq_server-*") do set RABBIT_DIR=%%i
cd /d "%RABBIT_DIR%\sbin"
call rabbitmq-plugins.bat enable rabbitmq_management
echo.
echo ========================================
echo  All done!
echo  RabbitMQ Management UI: http://localhost:15672
echo  Login: guest / guest
echo ========================================
pause
