@echo off
chcp 65001 >nul
title 在线图书商城 - 微服务启动脚本
echo ============================================
echo   在线图书商城微服务系统 - 一键启动
echo ============================================
echo.

REM ====== 1. 启动 MySQL (如果服务未运行) ======
echo [1/6] 检查 MySQL 状态...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo   ✅ MySQL 服务已在运行
) else (
    echo   ⏳ 正在启动 MySQL 服务...
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --datadir="C:\Users\31235\mysql-data" --port=3306
    echo   ✅ MySQL 已启动 (非服务模式)
)

REM ====== 2. 启动 Nacos ======
echo [2/6] 启动 Nacos 注册中心...
start "Nacos" /MIN cmd /c "cd /d D:\Projects\bookstore\infra\nacos\bin && startup.cmd -m standalone"
echo   ⏳ 等待 Nacos 启动 (约15秒)...
ping -n 16 127.0.0.1 >nul
echo   ✅ Nacos 已启动 (http://localhost:8848/nacos)

REM ====== 3. 启动 Sentinel Dashboard ======
echo [3/6] 启动 Sentinel Dashboard...
start "Sentinel" /MIN cmd /c "java -Dserver.port=8085 -jar D:\Projects\bookstore\infra\sentinel-dashboard.jar"
echo   ⏳ 等待 Sentinel 启动 (约10秒)...
ping -n 11 127.0.0.1 >nul
echo   ✅ Sentinel Dashboard 已启动 (http://localhost:8085, 账号: sentinel/sentinel)

REM ====== 4. 启动 Zipkin ======
echo [4/6] 启动 Zipkin 链路追踪...
start "Zipkin" /MIN cmd /c "java -jar D:\Projects\bookstore\infra\zipkin-server.jar"
echo   ⏳ 等待 Zipkin 启动 (约10秒)...
ping -n 11 127.0.0.1 >nul
echo   ✅ Zipkin 已启动 (http://localhost:9411)

REM ====== 5. 启动微服务 ======
echo [5/6] 启动微服务应用...
cd /d D:\Projects\bookstore

echo   ⏳ 启动 book-service (端口 8081)...
start "book-service" /MIN cmd /c "cd /d D:\Projects\bookstore && mvn.cmd spring-boot:run -pl book-service -Dspring-boot.run.jvmArguments="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED""
ping -n 5 127.0.0.1 >nul

echo   ⏳ 启动 user-service (端口 8082)...
start "user-service" /MIN cmd /c "cd /d D:\Projects\bookstore && mvn.cmd spring-boot:run -pl user-service -Dspring-boot.run.jvmArguments="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED""
ping -n 5 127.0.0.1 >nul

echo   ⏳ 启动 order-service (端口 8083)...
start "order-service" /MIN cmd /c "cd /d D:\Projects\bookstore && mvn.cmd spring-boot:run -pl order-service -Dspring-boot.run.jvmArguments="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED""
ping -n 5 127.0.0.1 >nul

echo   ⏳ 启动 evaluation-service (端口 8084)...
start "evaluation-service" /MIN cmd /c "cd /d D:\Projects\bookstore && mvn.cmd spring-boot:run -pl evaluation-service -Dspring-boot.run.jvmArguments="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED""
ping -n 5 127.0.0.1 >nul

echo   ⏳ 启动 gateway-service (端口 8080)...
start "gateway-service" /MIN cmd /c "cd /d D:\Projects\bookstore && mvn.cmd spring-boot:run -pl gateway-service -Dspring-boot.run.jvmArguments="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED""

echo.
echo ============================================
echo   🎉 所有服务已启动！
echo ============================================
echo.
echo   Nacos 控制台:     http://localhost:8848/nacos
echo   Sentinel 控制台:  http://localhost:8085  (sentinel/sentinel)
echo   Zipkin 控制台:    http://localhost:9411
echo   Gateway 入口:     http://localhost:8080
echo.
echo   book-service:     http://localhost:8081
echo   user-service:     http://localhost:8082
echo   order-service:    http://localhost:8083
echo   evaluation-service: http://localhost:8084
echo.
echo   按任意键查看服务状态...
pause >nul
