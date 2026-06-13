#!/bin/bash
# 在线图书商城 - 多实例启动脚本
# 同时启动 book-service 的两个实例以验证 Ribbon 负载均衡
# 需在 Git Bash 或 WSL 中运行

JVM_OPTS="--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED"
JAR="../book-service/target/book-service-1.0.0.jar"

if [ ! -f "$JAR" ]; then
  echo "[错误] 未找到 book-service JAR，请先执行: mvn clean package -pl book-service -am -DskipTests"
  exit 1
fi

echo "============================================"
echo " 启动 book-service 实例1 (端口 8081)..."
echo "============================================"
java $JVM_OPTS -jar "$JAR" --server.port=8081 &
PID1=$!
echo "  PID: $PID1"

sleep 5

echo "============================================"
echo " 启动 book-service 实例2 (端口 8086)..."
echo "============================================"
java $JVM_OPTS -jar "$JAR" --server.port=8086 &
PID2=$!
echo "  PID: $PID2"

echo ""
echo "两个实例已启动。验证负载均衡:"
echo "  curl http://localhost:8080/api/book/instance"
echo "（多次请求观察 port 字段切换）"
echo ""
echo "按 Ctrl+C 停止所有实例"

trap "kill $PID1 $PID2 2>/dev/null; echo '已停止'; exit" INT TERM
wait
