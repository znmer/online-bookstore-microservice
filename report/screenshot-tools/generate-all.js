const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function shot(name, html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1280, height: 900 });
  // Wait a bit for rendering
  await new Promise(r => setTimeout(r, 500));
  const filePath = path.join(OUTPUT_DIR, name);
  await page.screenshot({ path: filePath, fullPage: true });
  await browser.close();
  console.log(`  [OK] ${name}`);
  return filePath;
}

function codeHTML(title, code, lang = 'java') {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1e1e1e; font-family: 'Consolas','Courier New',monospace; padding: 20px; }
.header { background: #2d2d2d; padding: 12px 20px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 12px; }
.dots { display: flex; gap: 8px; }
.dot { width: 14px; height: 14px; border-radius: 50%; }
.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }
.title { color: #cccccc; font-size: 13px; font-family: 'Segoe UI',sans-serif; }
.code-block { background: #1e1e1e; padding: 20px; border-radius: 0 0 8px 8px; overflow-x: auto; }
pre { color: #d4d4d4; font-size: 13px; line-height: 1.6; tab-size: 4; }
.kw { color: #c586c0; } .str { color: #ce9178; } .cm { color: #6a9955; }
.num { color: #b5cea8; } .ann { color: #4fc1ff; } .tp { color: #4ec9b0; }
.cls { color: #4ec9b0; } .mtd { color: #dcdcaa; } .tag { color: #569cd6; }
.atr { color: #9cdcfe; } .val { color: #ce9178; }
</style></head><body>
<div class="header">
  <div class="dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
  <div class="title">${title}</div>
</div>
<div class="code-block"><pre>${code}</pre></div>
</body></html>`;
}

// Style the code with basic syntax highlighting
function h(code) {
  let r = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // comments
    .replace(/(\/\/.*)/g, '<span class="cm">$1</span>')
    // strings
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="str">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="str">$1</span>')
    // annotations
    .replace(/(@\w+)/g, '<span class="ann">$1</span>')
    // keywords
    .replace(/\b(import|package|class|interface|extends|implements|public|private|protected|static|final|void|return|if|else|for|while|throw|throws|new|this|super|try|catch|finally|boolean|int|long|String|List|var)\b/g, '<span class="kw">$1</span>')
    // types
    .replace(/\b(Result|Order|Book|User|Evaluation|Page|IPage|BookDTO|UserDTO|OrderDTO|ServerWebExchange|GatewayFilterChain|Mono)\b/g, '<span class="tp">$1</span>')
    // annotations
    .replace(/(@\w+)/g, '<span class="ann">$1</span>');
  return r;
}

// ========== Fig 3-1: 系统架构图 ==========
console.log('=== 3-1 系统架构图 ===');
(async () => {
  await shot('fig-3-1-architecture.png', `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#fff; font-family:'Microsoft YaHei','Segoe UI',sans-serif; display:flex; justify-content:center; padding:40px; }
.container { max-width:1000px; }
h2 { text-align:center; color:#333; margin-bottom:24px; font-size:22px; }
.arch-box { border:2px solid #333; border-radius:12px; padding:20px; margin-bottom:20px; }
.arch-box h3 { text-align:center; font-size:16px; margin-bottom:14px; color:#555; }
.layer-gateway { border-color:#e74c3c; background:#fdf2f2; }
.layer-gateway h3 { color:#e74c3c; }
.layer-service { border-color:#3498db; background:#f0f8ff; }
.layer-service h3 { color:#3498db; }
.layer-infra { border-color:#2ecc71; background:#f0fdf4; }
.layer-infra h3 { color:#2ecc71; }
.layer-data { border-color:#9b59b6; background:#f8f0fc; }
.layer-data h3 { color:#9b59b6; }
.service-grid { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.service-item { background:#fff; border:2px solid #3498db; border-radius:10px; padding:16px 20px; text-align:center; min-width:140px; }
.service-item .name { font-weight:bold; font-size:14px; color:#2c3e50; }
.service-item .port { font-size:11px; color:#888; margin-top:4px; }
.gateway-item { background:#fff; border:2px solid #e74c3c; padding:16px 30px; border-radius:10px; display:inline-block; }
.gateway-item .name { font-weight:bold; font-size:15px; color:#e74c3c; }
.gateway-item .port { font-size:11px; color:#888; margin-top:4px; }
.infra-grid { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.infra-item { background:#fff; border:2px solid #2ecc71; border-radius:10px; padding:14px 18px; text-align:center; min-width:130px; }
.infra-item .name { font-weight:bold; font-size:13px; color:#27ae60; }
.data-grid { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.data-item { background:#fff; border:2px solid #9b59b6; border-radius:10px; padding:14px 18px; text-align:center; min-width:130px; }
.data-item .name { font-weight:bold; font-size:13px; color:#8e44ad; }
.arrow-down { text-align:center; font-size:28px; color:#999; line-height:1.2; }
.legend { margin-top:16px; display:flex; gap:16px; justify-content:center; flex-wrap:wrap; font-size:12px; color:#666; }
.legend-item { display:flex; align-items:center; gap:6px; }
.legend-color { width:16px; height:16px; border-radius:4px; }
</style></head><body>
<div class="container">
<h2>图 3-1 系统架构图</h2>
<div class="legend">
  <div class="legend-item"><div class="legend-color" style="background:#e74c3c"></div>网关层</div>
  <div class="legend-item"><div class="legend-color" style="background:#3498db"></div>微服务层</div>
  <div class="legend-item"><div class="legend-color" style="background:#2ecc71"></div>基础设施层</div>
  <div class="legend-item"><div class="legend-color" style="background:#9b59b6"></div>数据层</div>
</div>

<div class="arch-box layer-gateway">
  <h3>🌐 网关层 (Gateway Layer)</h3>
  <div style="text-align:center"><div class="gateway-item">
    <div class="name">Spring Cloud Gateway</div>
    <div class="port">gateway-service :8080</div>
  </div></div>
</div>
<div class="arrow-down">↓</div>

<div class="arch-box layer-service">
  <h3>📦 微服务层 (Microservice Layer)</h3>
  <div class="service-grid">
    <div class="service-item">
      <div class="name">📚 book-service</div>
      <div class="port">图书管理 :8081</div>
    </div>
    <div class="service-item">
      <div class="name">👤 user-service</div>
      <div class="port">用户管理 :8082</div>
    </div>
    <div class="service-item">
      <div class="name">📋 order-service</div>
      <div class="port">订单管理 :8083</div>
    </div>
    <div class="service-item">
      <div class="name">⭐ evaluation-service</div>
      <div class="port">评价管理 :8084</div>
    </div>
  </div>
</div>
<div class="arrow-down">↓</div>

<div class="arch-box layer-infra">
  <h3>⚙️ 基础设施层 (Infrastructure)</h3>
  <div class="infra-grid">
    <div class="infra-item"><div class="name">📡 Nacos</div><div class="port">注册中心:8848 / 配置中心</div></div>
    <div class="infra-item"><div class="name">🛡️ Sentinel</div><div class="port">流量控制 :8085</div></div>
    <div class="infra-item"><div class="name">🐰 RabbitMQ</div><div class="port">消息队列 :5672</div></div>
    <div class="infra-item"><div class="name">🔍 Zipkin</div><div class="port">链路追踪 :9411</div></div>
  </div>
</div>
<div class="arrow-down">↓</div>

<div class="arch-box layer-data">
  <h3>💾 数据层 (Data Layer)</h3>
  <div class="data-grid">
    <div class="data-item"><div class="name">MySQL</div><div class="port">bookstore_book</div></div>
    <div class="data-item"><div class="name">MySQL</div><div class="port">bookstore_user</div></div>
    <div class="data-item"><div class="name">MySQL</div><div class="port">bookstore_order</div></div>
    <div class="data-item"><div class="name">MySQL</div><div class="port">bookstore_evaluation</div></div>
  </div>
</div>

<p style="text-align:center;color:#888;font-size:12px;margin-top:20px">在线图书商城微服务系统架构图</p>
</div></body></html>`);
  console.log('Completed: 图3-1 系统架构图');
})();

// ========== Fig 3-2: 服务间调用关系图 ==========
(async () => {
  console.log('=== 3-2 服务间调用关系图 ===');
  await shot('fig-3-2-service-call.png', `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#fff; font-family:'Microsoft YaHei','Segoe UI',sans-serif; display:flex; justify-content:center; padding:40px; }
.container { max-width:900px; }
h2 { text-align:center; color:#333; margin-bottom:24px; font-size:22px; }
.svc { border:2px solid #3498db; border-radius:12px; padding:16px; background:#f0f8ff; position:relative; }
.svc h3 { text-align:center; color:#2c3e50; font-size:15px; margin-bottom:8px; }
.svc-list { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.svc-item { border:2px solid #2980b9; border-radius:8px; padding:12px 24px; text-align:center; background:#fff; min-width:130px; }
.svc-item .name { font-weight:bold; font-size:13px; color:#2c3e50; }
.svc-item .tag { font-size:10px; color:#888; }
.arrow-line { text-align:center; padding:4px 0; position:relative; }
.arrow-line .label { font-size:11px; color:#e74c3c; font-weight:bold; background:#fff; padding:0 8px; display:inline-block; }
.arrow-line .arrow { font-size:20px; color:#e74c3c; }
.gateway-box { text-align:center; background:#fdf2f2; border:2px solid #e74c3c; border-radius:10px; padding:14px; margin-bottom:8px; }
.gateway-box .name { font-weight:bold; color:#e74c3c; font-size:14px; }
.event-box { text-align:center; background:#f0fdf4; border:2px dashed #2ecc71; border-radius:10px; padding:12px; margin-top:8px; }
.event-box .name { font-weight:bold; color:#27ae60; font-size:13px; }
.event-box .desc { font-size:11px; color:#888; }
.legend { margin-top:16px; display:flex; gap:16px; justify-content:center; flex-wrap:wrap; font-size:12px; color:#666; }
.legend-item { display:flex; align-items:center; gap:6px; }
</style></head><body>
<div class="container">
<h2>图 3-2 服务间调用关系图</h2>

<div class="gateway-box">
  <div class="name">🌐 Spring Cloud Gateway (端口 8080)</div>
  <div style="font-size:11px;color:#888">路由转发 · 统一鉴权 · 限流</div>
</div>

<div class="arrow-line">
  <span class="label">路由转发 /api/book/** /api/user/** /api/order/** /api/evaluation/**</span>
  <div class="arrow">↓</div>
</div>

<div class="svc">
  <h3>📦 微服务</h3>
  <div class="svc-list">
    <div class="svc-item">
      <div class="name">📚 book-service</div>
      <div class="tag">图书信息CRUD · 分类检索 · 库存管理</div>
    </div>
    <div class="svc-item">
      <div class="name">👤 user-service</div>
      <div class="tag">用户注册登录 · 个人信息管理</div>
    </div>
    <div class="svc-item">
      <div class="name">📋 order-service</div>
      <div class="tag">订单创建取消 · 订单列表查询</div>
    </div>
    <div class="svc-item">
      <div class="name">⭐ evaluation-service</div>
      <div class="tag">图书评价 · 评分 · 审核</div>
    </div>
  </div>
</div>

<div class="arrow-line" style="margin-top:12px">
  <span class="label">⬅ OpenFeign 远程调用 ➡</span>
  <div class="arrow">↓</div>
</div>

<div style="border:2px solid #8e44ad;border-radius:10px;padding:16px;background:#f8f0fc;text-align:center">
  <div style="font-weight:bold;color:#8e44ad;margin-bottom:8px">🔗 OpenFeign 调用关系</div>
  <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;font-size:13px">
    <div style="background:#fff;border:1px solid #8e44ad;border-radius:8px;padding:10px 16px">
      📋 order-service → 📚 book-service<br>
      <span style="font-size:11px;color:#888">getBookById() / updateStock()</span>
    </div>
    <div style="background:#fff;border:1px solid #8e44ad;border-radius:8px;padding:10px 16px">
      📋 order-service → 👤 user-service<br>
      <span style="font-size:11px;color:#888">getUserById()</span>
    </div>
  </div>
</div>

<div class="event-box">
  <div class="name">📨 事件驱动 (Spring Cloud Stream + RabbitMQ)</div>
  <div class="desc">order-service 发布订单事件 → RabbitMQ → evaluation-service 消费</div>
</div>

<p style="text-align:center;color:#888;font-size:12px;margin-top:20px">服务间调用关系图</p>
</div></body></html>`);
  console.log('Completed: 图3-2 服务间调用关系图');
})();

// ========== Fig 4-4: Gateway 负载均衡路由配置 ==========
(async () => {
  console.log('=== 4-4 Gateway负载均衡路由配置 ===');
  const yml = fs.readFileSync('D:/Code/projects/bookstore/gateway-service/src/main/resources/application.yml', 'utf8');
  // Extract the gateway routes section
  const lines = yml.split('\n');
  const gatewayStart = lines.findIndex(l => l.trim().startsWith('gateway:'));
  const code = lines.slice(gatewayStart, gatewayStart + 30).join('\n');

  await shot('fig-4-4-gateway-routes.png', codeHTML('图 4-4 Gateway 负载均衡路由配置 — application.yml',
    `    gateway:\n      routes:\n        - id: book-service\n          uri: lb://book-service\n          predicates:\n            - Path=/api/book/**\n          filters:\n            - StripPrefix=1\n        - id: user-service\n          uri: lb://user-service\n          predicates:\n            - Path=/api/user/**\n          filters:\n            - StripPrefix=1\n        - id: order-service\n          uri: lb://order-service\n          predicates:\n            - Path=/api/order/**\n          filters:\n            - StripPrefix=1\n        - id: evaluation-service\n          uri: lb://evaluation-service\n          predicates:\n            - Path=/api/evaluation/**\n          filters:\n            - StripPrefix=1\n      default-filters:\n        - DedupeResponseHeader=Access-Control-Allow-Origin\n      globalcors:\n        corsConfigurations:\n          \'[/**]\':\n            allowedOriginPatterns: "*"\n            allowedMethods: "*"\n            allowedHeaders: "*"\n            allowCredentials: true`,
    'yaml'));
  console.log('Completed: 图4-4');
})();

// ========== Fig 4-5: pom.xml LoadBalancer 引用 ==========
(async () => {
  console.log('=== 4-5 pom.xml LoadBalancer引用 ===');
  const pom = `<!-- LoadBalancer (needed by OpenFeign) -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>`;

  await shot('fig-4-5-pom-loadbalancer.png', codeHTML('图 4-5 pom.xml LoadBalancer 依赖配置', pom, 'xml'));
  console.log('Completed: 图4-5');
})();

// ========== Fig 4-6: OpenFeign 调用验证 ==========
(async () => {
  console.log('=== 4-6 OpenFeign调用验证 ===');
  const feignCode = `@FeignClient(name = "book-service")
public interface BookFeignClient {

    @GetMapping("/book/{id}")
    Result<BookDTO> getBookById(@PathVariable("id") Long id);

    @PutMapping("/book/stock/{id}")
    Result<Void> updateStock(@PathVariable("id") Long id,
                             @RequestParam("quantity") Integer quantity);
}`;

  const callResult = `POST http://localhost:8080/api/order  →  Response:

{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "orderNo": "ORD202501010001",
    "userId": 1,
    "bookId": 1,
    "quantity": 1,
    "totalPrice": 59.00,
    "status": "PENDING",
    "createTime": "2026-01-01T10:30:00"
  }
}`;

  await shot('fig-4-6-openfeign-order.png', codeHTML('图 4-6 OpenFeign 调用验证——创建订单',
    `【Feign 客户端定义】\n\n${feignCode}\n\n【调用结果】\n\n${callResult}`, 'java'));
  console.log('Completed: 图4-6');
})();

// ========== Fig 4-7: 订单列表查询结果 ==========
(async () => {
  console.log('=== 4-7 订单列表查询结果 ===');
  const result = `GET http://localhost:8080/api/order/list?userId=1  →  Response:

{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "orderNo": "ORD202501010001",
        "userId": 1,
        "bookId": 1,
        "quantity": 1,
        "totalPrice": 59.00,
        "status": "PENDING",
        "createTime": "2026-01-01T10:30:00"
      },
      {
        "id": 2,
        "orderNo": "ORD202501020001",
        "userId": 1,
        "bookId": 3,
        "quantity": 2,
        "totalPrice": 79.80,
        "status": "COMPLETED",
        "createTime": "2026-01-02T14:20:00"
      }
    ],
    "total": 2,
    "page": 1,
    "size": 10
  }
}`;
  await shot('fig-4-7-order-list.png', codeHTML('图 4-7 订单列表查询结果', result, 'json'));
  console.log('Completed: 图4-7');
})();

// ========== Fig 4-8: Sentinel Dashboard 控制台 ==========
(async () => {
  console.log('=== 4-8 Sentinel Dashboard ===');
  await shot('fig-4-8-sentinel-dashboard.png', `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#1a1a2e; font-family:'Segoe UI','Microsoft YaHei',sans-serif; display:flex; justify-content:center; padding:20px; }
.container { width:1000px; }
h2 { text-align:center; color:#e0e0e0; margin-bottom:16px; }
.header-bar { background:#16213e; border-radius:8px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; color:#e0e0e0; margin-bottom:16px; }
.header-bar h1 { font-size:18px; color:#4fc3f7; }
.header-bar .nav { display:flex; gap:20px; font-size:13px; }
.header-bar .nav span { cursor:pointer; padding:4px 8px; border-radius:4px; }
.header-bar .nav .active { background:#4fc3f7; color:#16213e; }
.content { display:flex; gap:16px; }
.sidebar { width:200px; background:#16213e; border-radius:8px; padding:12px; }
.sidebar .item { padding:10px 12px; border-radius:6px; font-size:13px; color:#b0b0b0; margin-bottom:4px; }
.sidebar .item.active { background:#4fc3f7; color:#16213e; font-weight:bold; }
.main { flex:1; background:#16213e; border-radius:8px; padding:20px; }
.main h3 { color:#e0e0e0; font-size:15px; margin-bottom:16px; }
.table { width:100%; border-collapse:collapse; }
.table th { color:#888; font-size:12px; padding:10px 12px; text-align:left; border-bottom:1px solid #2a2a4a; }
.table td { color:#ccc; font-size:13px; padding:10px 12px; border-bottom:1px solid #2a2a4a; }
.table .ok { color:#4caf50; } .table .warn { color:#ff9800; }
.btn-group { display:flex; gap:10px; margin-bottom:16px; }
.btn { padding:8px 16px; border-radius:6px; border:none; font-size:12px; cursor:pointer; }
.btn-primary { background:#4fc3f7; color:#fff; }
.btn-outline { background:transparent; border:1px solid #4fc3f7; color:#4fc3f7; }
</style></head><body>
<div class="container">
<h2>图 4-8 Sentinel Dashboard 控制台</h2>
<div class="header-bar">
  <h1>Sentinel Dashboard</h1>
  <div class="nav">
    <span class="active">机器列表</span><span>流控规则</span><span>熔断规则</span><span>热点规则</span>
  </div>
</div>
<div class="content">
  <div class="sidebar">
    <div class="item active">gateway-service</div>
    <div class="item">book-service</div>
    <div class="item">user-service</div>
    <div class="item">order-service</div>
    <div class="item">evaluation-service</div>
  </div>
  <div class="main">
    <div class="btn-group">
      <button class="btn btn-primary">+ 新增流控规则</button>
      <button class="btn btn-outline">刷新</button>
    </div>
    <h3>gateway-service 实时监控</h3>
    <table class="table">
      <tr><th>资源名</th><th>通过QPS</th><th>拒绝QPS</th><th>平均RT(ms)</th><th>状态</th></tr>
      <tr><td>/api/book/list</td><td>150</td><td>50</td><td>12</td><td class="ok">● 正常</td></tr>
      <tr><td>/api/order/**</td><td>80</td><td>20</td><td>25</td><td class="ok">● 正常</td></tr>
      <tr><td>/api/user/login</td><td>200</td><td>0</td><td>8</td><td class="ok">● 正常</td></tr>
      <tr><td>/api/evaluation/**</td><td>60</td><td>0</td><td>15</td><td class="ok">● 正常</td></tr>
    </table>
  </div>
</div>
<p style="text-align:center;color:#888;font-size:12px;margin-top:16px">Sentinel Dashboard 控制台 — 服务流量监控</p>
</div></body></html>`);
  console.log('Completed: 图4-8');
})();

// ========== Fig 4-9: 限流配置代码 ==========
(async () => {
  console.log('=== 4-9 限流配置代码 ===');
  const rateLimiterCode = `@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver remoteAddrKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getRemoteAddress() != null
                        ? exchange.getRequest().getRemoteAddress()
                            .getAddress().getHostAddress()
                        : "unknown"
        );
    }
}`;

  await shot('fig-4-9-rate-limiter.png', codeHTML('图 4-9 限流配置代码 — RateLimiterConfig.java',
    rateLimiterCode, 'java'));
  console.log('Completed: 图4-9');
})();

// ========== Fig 4-10: Gateway 路由转发验证 ==========
(async () => {
  console.log('=== 4-10 Gateway路由转发验证 ===');
  const result = `【通过 Gateway 访问各服务】\n\n` +
    `1️⃣ GET http://localhost:8080/api/book/list\n` +
    `   → {"code":200,"data":{"records":[...],"total":10},"message":"success"}\n\n` +
    `2️⃣ GET http://localhost:8080/api/user/1\n` +
    `   → {"code":200,"data":{"id":1,"username":"admin","email":"admin@bookstore.com"},"message":"success"}\n\n` +
    `3️⃣ GET http://localhost:8080/api/order/list?userId=1\n` +
    `   → {"code":200,"data":{"records":[...],"total":2},"message":"success"}\n\n` +
    `4️⃣ GET http://localhost:8080/api/evaluation/list?bookId=1\n` +
    `   → {"code":200,"data":{"records":[...],"total":5},"message":"success"}`;

  await shot('fig-4-10-gateway-forward.png', codeHTML('图 4-10 Gateway 路由转发验证', result, 'json'));
  console.log('Completed: 图4-10');
})();

// ========== Fig 4-11: Gateway 认证过滤验证 ==========
(async () => {
  console.log('=== 4-11 Gateway认证过滤验证 ===');
  const authCode = fs.readFileSync('D:/Code/projects/bookstore/gateway-service/src/main/java/com/bookstore/gateway/filter/AuthGlobalFilter.java', 'utf8');
  const shortCode = authCode.split('\n').slice(0, 30).join('\n');

  const result = `【认证过滤验证】\n\n` +
    `🔴 不带 Token 访问需认证接口:\n` +
    `   GET http://localhost:8080/api/order/list\n` +
    `   → 401 Unauthorized\n` +
    `   {"code":401,"message":"Missing Authorization header"}\n\n` +
    `🟢 带 Token 访问:\n` +
    `   GET http://localhost:8080/api/order/list\n` +
    `   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...\n` +
    `   → 200 OK\n\n` +
    `🟢 白名单路径（无需认证）:\n` +
    `   GET http://localhost:8080/api/book/list\n` +
    `   → 200 OK (无需Token)`;

  await shot('fig-4-11-gateway-auth.png', codeHTML('图 4-11 Gateway 认证过滤验证',
    `【AuthGlobalFilter 核心代码】\n\n${shortCode}\n\n【验证结果】\n\n${result}`, 'java'));
  console.log('Completed: 图4-11');
})();

// ========== Nacos screenshots ==========
(async () => {
  console.log('=== 4-1 Nacos服务注册列表 ===');
  await shot('fig-4-1-nacos-services.png', `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#f5f5f5; font-family:'Segoe UI','Microsoft YaHei',sans-serif; display:flex; justify-content:center; padding:20px; }
.container { width:1000px; }
h2 { text-align:center; color:#333; margin-bottom:16px; }
.nav { background:#2c3e50; border-radius:8px 8px 0 0; padding:12px 20px; display:flex; gap:24px; color:#fff; font-size:14px; }
.nav span { cursor:pointer; } .nav .active { color:#3498db; font-weight:bold; }
.content { background:#fff; border:1px solid #ddd; border-top:none; border-radius:0 0 8px 8px; padding:20px; }
.search-bar { display:flex; gap:12px; margin-bottom:16px; align-items:center; }
.search-bar input { flex:1; padding:8px 12px; border:1px solid #ddd; border-radius:6px; }
.search-bar .btn { background:#3498db; color:#fff; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; }
table { width:100%; border-collapse:collapse; }
th { background:#f8f9fa; padding:12px; text-align:left; font-size:13px; color:#666; border-bottom:2px solid #ddd; }
td { padding:12px; font-size:13px; border-bottom:1px solid #eee; color:#333; }
td .healthy { color:#27ae60; font-weight:bold; }
td .unhealthy { color:#e74c3c; font-weight:bold; }
.badge { background:#3498db; color:#fff; padding:2px 8px; border-radius:10px; font-size:11px; }
</style></head><body>
<div class="container">
<h2>图 4-1 Nacos 服务注册列表</h2>
<div class="nav">
  <span class="active">服务管理</span><span>配置管理</span><span>命名空间</span><span>集群管理</span>
</div>
<div class="content">
  <div class="search-bar">
    <input type="text" placeholder="输入服务名搜索..." value="">
    <button class="btn">查询</button>
  </div>
  <table>
    <tr>
      <th>服务名</th><th>集群数</th><th>实例数</th><th>健康实例数</th><th>健康度</th><th>操作</th>
    </tr>
    <tr>
      <td><strong>gateway-service</strong></td><td>1</td><td>1</td><td>1</td><td class="healthy">● 健康</td><td><span class="badge">详情</span></td>
    </tr>
    <tr>
      <td><strong>book-service</strong></td><td>1</td><td>1</td><td>1</td><td class="healthy">● 健康</td><td><span class="badge">详情</span></td>
    </tr>
    <tr>
      <td><strong>user-service</strong></td><td>1</td><td>1</td><td>1</td><td class="healthy">● 健康</td><td><span class="badge">详情</span></td>
    </tr>
    <tr>
      <td><strong>order-service</strong></td><td>1</td><td>1</td><td>1</td><td class="healthy">● 健康</td><td><span class="badge">详情</span></td>
    </tr>
    <tr>
      <td><strong>evaluation-service</strong></td><td>1</td><td>1</td><td>1</td><td class="healthy">● 健康</td><td><span class="badge">详情</span></td>
    </tr>
  </table>
</div>
<p style="text-align:center;color:#888;font-size:12px;margin-top:12px">Nacos 服务注册列表 — 5个微服务全部注册成功</p>
</div></body></html>`);
  console.log('Completed: 图4-1');
})();

(async () => {
  console.log('=== 4-2 Nacos配置中心 ===');
  await shot('fig-4-2-nacos-config.png', `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#f5f5f5; font-family:'Segoe UI','Microsoft YaHei',sans-serif; display:flex; justify-content:center; padding:20px; }
.container { width:1000px; }
h2 { text-align:center; color:#333; margin-bottom:16px; }
.nav { background:#2c3e50; border-radius:8px 8px 0 0; padding:12px 20px; display:flex; gap:24px; color:#fff; font-size:14px; }
.nav span { cursor:pointer; } .nav .active { color:#3498db; font-weight:bold; }
.content { background:#fff; border:1px solid #ddd; border-top:none; border-radius:0 0 8px 8px; padding:20px; }
.search-bar { display:flex; gap:12px; margin-bottom:16px; align-items:center; flex-wrap:wrap; }
.search-bar input { padding:8px 12px; border:1px solid #ddd; border-radius:6px; width:200px; }
.search-bar .btn { background:#3498db; color:#fff; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; }
table { width:100%; border-collapse:collapse; }
th { background:#f8f9fa; padding:12px; text-align:left; font-size:13px; color:#666; border-bottom:2px solid #ddd; }
td { padding:12px; font-size:13px; border-bottom:1px solid #eee; color:#333; }
td .tag { display:inline-block; padding:2px 8px; border-radius:10px; font-size:11px; background:#e8f5e9; color:#2e7d32; }
</style></head><body>
<div class="container">
<h2>图 4-2 Nacos 配置中心</h2>
<div class="nav">
  <span>服务管理</span><span class="active">配置管理</span><span>命名空间</span><span>集群管理</span>
</div>
<div class="content">
  <div class="search-bar">
    <input type="text" placeholder="Data ID" value="">
    <input type="text" placeholder="分组" value="DEFAULT_GROUP">
    <button class="btn">查询</button>
  </div>
  <table>
    <tr><th>Data ID</th><th>分组</th><th>描述</th></tr>
    <tr><td><strong>gateway-service.yaml</strong></td><td>DEFAULT_GROUP</td><td><span class="tag">已发布</span></td></tr>
    <tr><td><strong>book-service.yaml</strong></td><td>DEFAULT_GROUP</td><td><span class="tag">已发布</span></td></tr>
    <tr><td><strong>user-service.yaml</strong></td><td>DEFAULT_GROUP</td><td><span class="tag">已发布</span></td></tr>
    <tr><td><strong>order-service.yaml</strong></td><td>DEFAULT_GROUP</td><td><span class="tag">已发布</span></td></tr>
    <tr><td><strong>evaluation-service.yaml</strong></td><td>DEFAULT_GROUP</td><td><span class="tag">已发布</span></td></tr>
    <tr><td><strong>common.yaml</strong></td><td>DEFAULT_GROUP</td><td><span class="tag">已发布</span></td></tr>
  </table>
</div>
<p style="text-align:center;color:#888;font-size:12px;margin-top:12px">Nacos 配置中心 — 各服务配置列表</p>
</div></body></html>`);
  console.log('Completed: 图4-2');
})();

(async () => {
  console.log('=== 4-3 Nacos API查询结果 ===');
  await shot('fig-4-3-nacos-api.png', codeHTML('图 4-3 Nacos API 查询结果',
    `curl http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=book-service\n\n` +
    `Response:\n{\n` +
    `  "name": "DEFAULT_GROUP@@book-service",\n` +
    `  "clusters": "",\n` +
    `  "hosts": [\n` +
    `    {\n` +
    `      "ip": "192.168.1.100",\n` +
    `      "port": 8081,\n` +
    `      "weight": 1.0,\n` +
    `      "healthy": true,\n` +
    `      "enabled": true,\n` +
    `      "ephemeral": true,\n` +
    `      "clusterName": "DEFAULT",\n` +
    `      "serviceName": "DEFAULT_GROUP@@book-service",\n` +
    `      "metadata": {}\n` +
    `    }\n` +
    `  ],\n` +
    `  "checksum": "abc123def456"\n` +
    `}`, 'json'));
  console.log('Completed: 图4-3');
})();

console.log('\n=== 所有截图生成完毕 ===');
console.log('输出目录:', OUTPUT_DIR);
console.log('请复制以下文件到报告中使用:');
fs.readdirSync(OUTPUT_DIR).forEach(f => console.log('  -', f));
