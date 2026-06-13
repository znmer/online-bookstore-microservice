@echo off
chcp 65001 >nul
title 图书商城微服务 - 多实例启动
echo ============================================
echo  在线图书商城 - 多实例启动脚本
echo  同时启动 book-service 的两个实例以验证 Ribbon 负载均衡
echo ============================================
echo.

:: JVM 参数
set JVM_OPTS=--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED

:: 检查 JAR 是否存在
if not exist "..\book-service\target\book-service-1.0.0.jar" (
    echo [错误] 未找到 book-service JAR，请先执行: mvn clean package -pl book-service -am -DskipTests
    pause
    exit /b 1
)

echo [1/3] 启动 book-service 实例1（端口 8081）...
start "book-service-8081" cmd /c "title book-service-8081 && java %JVM_OPTS% -jar ..\book-service\target\book-service-1.0.0.jar --server.port=8081"
echo   ✓ 实例1启动中，Nacos 服务名: book-service

timeout /t 5 /nobreak >nul

echo [2/3] 启动 book-service 实例2（端口 8086）...
start "book-service-8086" cmd /c "title book-service-8086 && java %JVM_OPTS% -jar ..\book-service\target\book-service-1.0.0.jar --server.port=8086"
echo   ✓ 实例2启动中，Nacos 服务名: book-service

echo.
echo [3/3] 等待实例注册到 Nacos...
timeout /t 8 /nobreak >nul

echo.
echo ============================================
echo  验证负载均衡：
echo    curl http://localhost:8080/api/book/instance
echo    （多次请求观察 port 字段在 8081/8086 间轮询）
echo ============================================
echo.
echo 按任意键停止所有实例...
pause >nul

:: 停止所有 java 进程（谨慎使用）
echo 正在停止所有 book-service 实例...
taskkill /f /fi "WINDOWTITLE eq book-service-8081" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq book-service-8086" >nul 2>&1
echo 已停止。
pause
