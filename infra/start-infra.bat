@echo off
chcp 65001 >nul
echo Starting Infrastructure Services...
echo.

echo [1/5] MySQL should already be running (port 3306)
echo.

echo [2/5] Starting Nacos (port 8848)...
start "Nacos" /B java -Dnacos.standalone=true -jar "D:\Projects\bookstore\infra\nacos\nacos\target\nacos-server.jar"
echo Nacos starting... wait 30 seconds
timeout /t 30 /nobreak >nul

echo [3/5] Starting Sentinel Dashboard (port 8085)...
start "Sentinel" /B java -Dserver.port=8085 -jar "D:\Projects\bookstore\infra\sentinel-dashboard.jar"

echo [4/5] Starting Zipkin (port 9411)...
start "Zipkin" /B java -jar "D:\Projects\bookstore\infra\zipkin-server.jar"

echo.
echo Infrastructure is starting up. Proceed to start microservices.
echo.
