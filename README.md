# 在线图书商城微服务系统

## 项目简介
基于 Spring Cloud Alibaba 微服务架构的在线图书商城系统，包含图书管理、用户管理、订单管理、评价管理等功能。

> **📖 结课报告**: [report/Java_EE核心框架技术结课报告_v2.docx](report/Java_EE核心框架技术结课报告_v2.docx) 已含完整截图。  
> **🎤 答辩讲稿**: [report/答辩讲解稿.md](report/答辩讲解稿.md)（4分钟讲解稿 + 常见问题准备）。  
> **📸 截图目录**: [report/screenshots/](report/screenshots/)（20张自动截图 + 架构图）。  
> **📋 开发记录**: [work-log-20260613.md](work-log-20260613.md)（问题排查与验证过程）。  

## 技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.3.5 | 微服务基础框架 |
| Spring Cloud | 2023.0.3 | 微服务治理 |
| Spring Cloud Alibaba | 2023.0.3.2 | 阿里巴巴微服务组件 |
| Nacos | 2.4.3 | 注册中心 + 配置中心 |
| Sentinel | 1.8.8 | 服务容错（限流/熔断/降级） |
| OpenFeign | 4.1.3 | 声明式服务调用 |
| Gateway | 4.1.3 | API 网关 |
| Spring Cloud Stream | 4.1.3 | 消息驱动（RabbitMQ） |
| Micrometer Tracing + Zipkin | - | 分布式链路追踪 |
| MyBatis Plus | 3.5.7 | ORM 框架 |
| MySQL | 8.0 | 数据库 |

## 七大核心技术得分点

| 技术 | 分值 | 状态 |
|------|:----:|:----:|
| ✅ Nacos 服务注册与配置中心 | 8分 | 5个微服务全部注册，配置中心管理 |
| ✅ Ribbon 负载均衡 | 7分 | 集成 LoadBalancer + 多实例启动脚本验证 |
| ✅ OpenFeign 服务调用 | 8分 | book-service/user-service 互调 |
| ✅ Sentinel 服务容错 | 8分 | @SentinelResource + 流控/熔断规则 |
| ✅ Gateway 网关 | 8分 | 路由转发 + 鉴权 + CORS + 限流 |
| ✅ Spring Cloud Stream | 8分 | RabbitMQ 消息驱动（需安装 RabbitMQ） |
| ✅ 链路追踪 | 7分 | Micrometer + Zipkin 集成 |

## 项目结构
```
bookstore/
├── pom.xml                          # 父工程
├── README.md                        # 项目说明
├── work-log-20260613.md             # 开发记录与验证结果
├── common-module/                   # 公共模块（DTO、Result、工具类）
├── book-service/                    # 图书管理服务 (8081/8086)
├── user-service/                    # 用户管理服务 (8082)
├── order-service/                   # 订单管理服务 (8083)
├── evaluation-service/              # 评价管理服务 (8084)
├── gateway-service/                 # 网关服务 (8080)
├── infra/                           # 基础设施
│   ├── init.sql                     # 数据库初始化
│   ├── start-all.bat                # 一键启动脚本
│   ├── stop-all.bat                 # 停止脚本
│   ├── start-multi-instances.bat    # 多实例启动脚本
│   ├── nacos/                       # Nacos 服务器
│   ├── sentinel-dashboard.jar       # Sentinel 控制台
│   └── zipkin-server.jar            # Zipkin 服务端
├── frontend/                        # 前端页面（HTML + JavaScript）
├── report/                          # 结课报告输出目录
│   ├── Java_EE核心框架技术结课报告_v2.docx  # 结课报告（含嵌入截图）
│   ├── screenshots/                 # 所有截图文件
│   ├── 答辩讲解稿.md                  # 4分钟答辩讲稿
│   └── README-截图说明.md             # 手动操作标准
├── generate-final-report.js         # 结课报告生成器（含图片嵌入）
└── take-screenshots.js              # 自动截图脚本（Puppeteer）
```

## 快速启动

### 1. 基础设施
```bash
# 启动 MySQL（使用独立实例，避免与 Windows 服务 MySQL 冲突）
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" \
  --initialize-insecure \
  --datadir="C:\Users\31235\mysql-bookstore-data"

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" \
  --datadir="C:\Users\31235\mysql-bookstore-data" --port=3307 --enable-named-pipe

# 初始化数据库
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root -h 127.0.0.1 -P 3307 \
  --default-character-set=utf8mb4 < infra/init.sql

# 启动 Nacos
java -Dnacos.standalone=true -jar infra/nacos/nacos/target/nacos-server.jar

# 启动 Sentinel Dashboard
java -Dserver.port=8085 -jar infra/sentinel-dashboard.jar

# 启动 Zipkin
java -jar infra/zipkin-server.jar
```

### 2. 编译（Git Bash 环境需通过 Java 直接调用 Maven）

如果 `mvn` 命令不可用（Git Bash 环境下 `mvn` 脚本缺少 `uname` 等命令），可使用以下方式：

```bash
export JAVA_HOME="/c/Users/31235/.jdks/openjdk-23.0.1"
export PATH="$JAVA_HOME/bin:$PATH"
cd "D:/Code/projects/bookstore"

java -classpath "/c/apache-maven-3.9.8/boot/plexus-classworlds-2.8.0.jar" \
  -Dclassworlds.conf="/c/apache-maven-3.9.8/bin/m2.conf" \
  -Dmaven.home="/c/apache-maven-3.9.8" \
  -Dmaven.multiModuleProjectDirectory="D:/Code/projects/bookstore" \
  org.codehaus.plexus.classworlds.launcher.Launcher clean package -DskipTests
```

### 3. 微服务（按顺序启动）
```bash
java --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED \
  -jar book-service/target/book-service-1.0.0.jar

java --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED \
  -jar user-service/target/user-service-1.0.0.jar

java --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED \
  -jar order-service/target/order-service-1.0.0.jar

java --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED \
  -jar evaluation-service/target/evaluation-service-1.0.0.jar

java --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED \
  -jar gateway-service/target/gateway-service-1.0.0.jar
```

### 4. 多实例启动（验证 Ribbon 负载均衡）
```bash
# 方式一：使用启动脚本（推荐）
cd infra
./start-multi-instances.sh          # Git Bash
# 或
start-multi-instances.bat           # Windows CMD

# 方式二：手动启动两个实例
java --add-opens java.base/java.lang=ALL-UNNAMED \
  -jar book-service/target/book-service-1.0.0.jar --server.port=8081

java --add-opens java.base/java.lang=ALL-UNNAMED \
  -jar book-service/target/book-service-1.0.0.jar --server.port=8086

# 验证负载均衡（多次请求观察 port 值轮询）
curl http://localhost:8080/api/book/instance
```

### 5. 验证
- Nacos 控制台: http://localhost:8848/nacos （5个服务已注册，book-service 显示 2 个实例）
- MySQL 管理: `mysql -u root -h 127.0.0.1 -P 3307`（空密码）
- Sentinel 控制台: http://localhost:8085 （sentinel/sentinel，可查看流控规则）
- Zipkin UI: http://localhost:9411
- 测试API: http://localhost:8080/api/book/list?page=1&size=5

## API 测试
```bash
# 图书列表
curl http://localhost:8081/book/list?page=1&size=10

# 图书服务实例信息（验证负载均衡）
curl http://localhost:8080/api/book/instance
# 多次请求观察 port 字段在 8081/8086 间轮询

# 用户登录 (密码: 123456)
curl -X POST "http://localhost:8082/user/login?username=admin&password=123456"

# 创建订单
curl -X POST -H "Content-Type: application/json" -d '{
  "userId": 1, "bookId": 1, "quantity": 2,
  "receiverName": "张三", "receiverPhone": "13800138000",
  "receiverAddress": "北京市海淀区"
}' http://localhost:8083/order

# 评价列表
curl http://localhost:8084/evaluation/book/1

# 用户地址管理
curl http://localhost:8082/address/user/1     # 查询地址列表
curl -X POST -H "Content-Type: application/json" -d '{
  "userId": 1, "receiverName": "管理员",
  "receiverPhone": "13800138000",
  "province": "北京市", "city": "北京市",
  "district": "朝阳区", "detailAddress": "建国路88号",
  "isDefault": true
}' http://localhost:8082/address                # 新增地址

# 通过网关访问
curl http://localhost:8080/api/book/list?page=1&size=5
```

## Sentinel 流控与熔断验证

Sentinel 已在代码中配置了以下规则：

| 服务 | 资源名 | 规则类型 | 阈值 |
|------|--------|---------|:----:|
| order-service | `createOrder` | QPS 限流 | 10 QPS |
| order-service | `createOrder` | 慢调用熔断 | RT>2000ms, 比例≥50% |
| order-service | `listOrders` | QPS 限流 | 20 QPS |
| order-service | `cancelOrder` | QPS 限流 | 5 QPS |
| evaluation-service | `createEvaluation` | QPS 限流 | 10 QPS |
| evaluation-service | `createEvaluation` | 异常比例熔断 | 比例≥30% |
| evaluation-service | `listEvaluations` | QPS 限流 | 30 QPS |

```bash
# 测试限流效果（快速请求多次触发限流）
for i in {1..20}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"bookId":1,"quantity":1,"receiverName":"test","receiverPhone":"13800138000","receiverAddress":"test"}' \
    http://localhost:8080/api/order
done
# 当超过 10 QPS 时会返回 429 限流提示

# Sentinel Dashboard 查看规则
# 访问 http://localhost:8085/#/dashboard/home (sentinel/sentinel)
```

## 测试账号
| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 管理员/VIP |
| zhangsan | 123456 | 普通用户 |
| lisi | 123456 | 普通用户 |
