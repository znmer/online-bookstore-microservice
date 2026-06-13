# 截图说明与手动操作标准

## 生成的文件

### 结课报告
- **Word报告**: `report/Java_EE核心框架技术结课报告.docx` (23.4 KB)
- **截图目录**: `report/screenshots/` (18张自动截图 + 预存架构图)

### 自动截图清单

| 序号 | 文件名 | 内容 | 状态 |
|:----:|--------|------|:----:|
| 01 | nacos-console | Nacos 登录页面 | ✅ 自动 |
| 02 | nacos-service-list | Nacos 服务列表 | ✅ 自动 |
| 03 | sentinel-dashboard | Sentinel 仪表盘 | ✅ 自动 |
| 04 | sentinel-flow-rules | Sentinel 流控规则 | ✅ 自动 |
| 05 | zipkin-ui | Zipkin 查询页面 | ✅ 自动 |
| 06 | book-list-direct | 图书列表(直连8081) | ✅ 自动 |
| 07 | book-list-gateway | 图书列表(通过网关) | ✅ 自动 |
| 08-10 | ribbon-lb-* | 负载均衡(3次请求) | ✅ 自动 |
| 11 | user-login | 用户登录结果 | ✅ 自动 |
| 12 | create-order | 创建订单结果 | ✅ 自动 |
| 13 | stock-after-order | 库存扣减验证 | ✅ 自动 |
| 14 | user-orders-via-feign | Feign调用验证(用户订单) | ✅ 自动 |
| 15 | evaluation-list | 评价列表 | ✅ 自动 |
| 16 | address-list | 地址列表 | ✅ 自动 |
| 17 | gateway-auth-fail | 网关鉴权(非白名单→401) | ✅ 自动 |
| 18 | gateway-auth-pass | 网关鉴权(白名单→200) | ✅ 自动 |
| 19 | sentinel-rate-limit | Sentinel限流测试 | ✅ 自动 |
| 20 | frontend-home | 前端页面首页 | ✅ 自动 |

### 预存图片
| 文件名 | 内容 |
|--------|------|
| fig-3-1-architecture.png | 系统架构图 |
| fig-3-2-service-call.png | 服务调用关系图 |
| fig-4-1-nacos-services.png | Nacos服务列表 |
| fig-4-2-nacos-config.png | Nacos配置管理 |
| fig-4-3-nacos-api.png | Nacos API示例 |
| fig-4-4-gateway-routes.png | Gateway路由配置 |
| fig-4-5-pom-loadbalancer.png | POM负载均衡依赖 |
| fig-4-6-openfeign-order.png | OpenFeign订单调用 |
| fig-4-7-order-list.png | 订单列表 |
| fig-4-8-sentinel-dashboard.png | Sentinel控制台 |
| fig-4-9-rate-limiter.png | 限流配置 |
| fig-4-10-gateway-forward.png | Gateway转发示例 |
| fig-4-11-gateway-auth.png | Gateway鉴权示例 |

## 手动操作标准（用于替换不满意的自动截图）

如果自动截图效果不理想，请按以下步骤手动操作：

### 1. Nacos 控制台
```
1. 打开 http://localhost:8848/nacos
2. 输入账号/密码: nacos/nacos（默认）
3. 进入"服务管理→服务列表"页面
4. 截图展示：book-service(2个实例)、user-service、order-service、evaluation-service、gateway-service
5. 截图展示配置管理页面
```

### 2. Sentinel 控制台
```
1. 打开 http://localhost:8085
2. 输入账号/密码: sentinel/sentinel（默认）
3. 点击 order-service 查看流控规则
4. 截图展示：createOrder(QPS=10)、listOrders(QPS=20)、cancelOrder(QPS=5) 等规则
5. 切换 evaluation-service 查看规则
```

### 3. Zipkin 链路追踪
```
1. 打开 http://localhost:9411/zipkin/
2. 点击 "Run Query" 查询所有链路
3. 截图展示：服务调用链路、耗时统计、依赖拓扑图
```

### 4. API 终端验证（建议在 VS Code 终端或 Windows Terminal 中执行）
```bash
# 图书列表
curl http://localhost:8081/book/list?page=1&size=5

# 网关转发
curl http://localhost:8080/api/book/list?page=1&size=5

# 负载均衡（多次执行观察端口轮询）
curl http://localhost:8080/api/book/instance
# 期望输出: port:8081 和 port:8086 交替

# 用户登录
curl -X POST -d "username=admin&password=123456" \
  http://localhost:8082/user/login

# 创建订单
curl -X POST -H "Content-Type: application/json" \
  -d '{"userId":1,"bookId":1,"quantity":1,"receiverName":"张三","receiverPhone":"13800138000","receiverAddress":"北京市海淀区"}' \
  http://localhost:8083/order

# 验证库存扣减
curl http://localhost:8081/book/1

# Feign调用验证
curl http://localhost:8082/user/1/orders

# 评价列表
curl http://localhost:8084/evaluation/book/1

# 地址列表
curl http://localhost:8082/address/user/1

# 网关鉴权
curl http://localhost:8080/api/order  # 期望:401
curl http://localhost:8080/api/book/list?page=1  # 期望:200

# Sentinel限流（快速请求）
for i in {1..15}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"bookId":1,"quantity":1,"receiverName":"test","receiverPhone":"13800138000","receiverAddress":"test"}' \
    http://localhost:8083/order
done
# 前10次返回200，后续返回429
```

### 5. 前端页面
```
1. 在浏览器中打开 frontend/index.html
2. 截图：首页图书列表
3. 点击"登录"，输入 admin/123456 → 截图登录成功
4. 点击"创建订单" → 截图订单表单
5. 点击"评价" → 截图评价列表
```
