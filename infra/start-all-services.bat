@echo off
chcp 65001 >nul
set JAVA_HOME=C:\Program Files\Java\jdk-23
set PATH=%JAVA_HOME%\bin;%PATH%
set DIR=D:\Projects\bookstore\infra

echo Starting Infrastructure...
echo [1] Nacos (port 8848)
start /B "Nacos" java -Dnacos.standalone=true -jar "%DIR%\nacos\nacos\target\nacos-server.jar" > "%DIR%\nacos.log" 2> "%DIR%\nacos.err"

echo [2] Sentinel Dashboard (port 8085)
start /B "Sentinel" java -Dserver.port=8085 -jar "%DIR%\sentinel-dashboard.jar" > "%DIR%\sentinel.log" 2> "%DIR%\sentinel.err"

echo [3] Zipkin (port 9411)
start /B "Zipkin" java -jar "%DIR%\zipkin-server.jar" > "%DIR%\zipkin.log" 2> "%DIR%\zipkin.err"

echo Waiting 40 seconds for infrastructure to initialize...
ping -n 41 127.0.0.1 >nul

echo Starting Microservices...
set ADD_OPENS=--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED
set TARGET=D:\Projects\bookstore

echo [4] book-service (8081)
start /B "book-service" java %ADD_OPENS% -jar "%TARGET%\book-service\target\book-service-1.0.0.jar" > "%DIR%\book-service.log" 2> "%DIR%\book-service.err"

echo [5] user-service (8082)
start /B "user-service" java %ADD_OPENS% -jar "%TARGET%\user-service\target\user-service-1.0.0.jar" > "%DIR%\user-service.log" 2> "%DIR%\user-service.err"

echo [6] order-service (8083)
start /B "order-service" java %ADD_OPENS% -jar "%TARGET%\order-service\target\order-service-1.0.0.jar" > "%DIR%\order-service.log" 2> "%DIR%\order-service.err"

echo [7] evaluation-service (8084)
start /B "evaluation-service" java %ADD_OPENS% -jar "%TARGET%\evaluation-service\target\evaluation-service-1.0.0.jar" > "%DIR%\evaluation-service.log" 2> "%DIR%\evaluation-service.err"

echo [8] gateway-service (8080)
start /B "gateway-service" java %ADD_OPENS% -jar "%TARGET%\gateway-service\target\gateway-service-1.0.0.jar" > "%DIR%\gateway-service.log" 2> "%DIR%\gateway-service.err"

echo All services started! Check logs in %DIR%
