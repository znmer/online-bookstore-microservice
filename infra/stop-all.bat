@echo off
chcp 65001 >nul
title 停止所有服务
echo 正在停止所有微服务...
taskkill /F /FI "WindowTitle eq book-service" 2>nul
taskkill /F /FI "WindowTitle eq user-service" 2>nul
taskkill /F /FI "WindowTitle eq order-service" 2>nul
taskkill /F /FI "WindowTitle eq evaluation-service" 2>nul
taskkill /F /FI "WindowTitle eq gateway-service" 2>nul
taskkill /F /IM "sentinel-dashboard.jar" 2>nul
taskkill /F /IM "zipkin-server.jar" 2>nul
taskkill /F /FI "WindowTitle eq Nacos" 2>nul
echo ✅ 所有服务已停止
pause
