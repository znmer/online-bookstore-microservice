const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = 'D:/Code/projects/bookstore/report/screenshots';
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function takeScreenshot(page, url, filename, opts = {}) {
  try {
    console.log(`Capturing ${filename} from ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, opts.wait || 1500));

    if (opts.action) {
      await opts.action(page);
      await new Promise(r => setTimeout(r, 800));
    }

    const outPath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: outPath, fullPage: opts.full || false });
    console.log(`  ✓ Saved: ${outPath}`);
    return true;
  } catch (e) {
    console.log(`  ✗ Failed: ${filename} - ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const results = {};

  // ========== 基础设施控制台 ==========
  console.log('\n=== 基础设施控制台截图 ===');

  // 1. Nacos 控制台
  results.nacos = await takeScreenshot(page,
    'http://localhost:8848/nacos/',
    '01-nacos-console.png',
    { wait: 3000, action: async (p) => {
      // 尝试登录 (nacos/nacos)
      try {
        const userInput = await p.$('input[placeholder*="username"], input[name="username"]');
        if (userInput) {
          await userInput.click({ clickCount: 3 });
          await userInput.type('nacos');
          const pwdInput = await p.$('input[type="password"]');
          if (pwdInput) {
            await pwdInput.click({ clickCount: 3 });
            await pwdInput.type('nacos');
            const loginBtn = await p.$('button[type="submit"], button.Login--loginBtn');
            if (loginBtn) await loginBtn.click();
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      } catch(e) {}
    }}
  );

  // 1b. Nacos 服务列表
  results.nacos_services = await takeScreenshot(page,
    'http://localhost:8848/nacos/#/serviceManagement',
    '02-nacos-service-list.png',
    { wait: 3000 }
  );

  // 2. Sentinel 控制台
  results.sentinel = await takeScreenshot(page,
    'http://localhost:8085/',
    '03-sentinel-dashboard.png',
    { wait: 3000, action: async (p) => {
      try {
        const userInput = await p.$('input[type="text"], input[placeholder*="username"]');
        if (userInput) {
          await userInput.click({ clickCount: 3 });
          await userInput.type('sentinel');
          const pwdInput = await p.$('input[type="password"]');
          if (pwdInput) {
            await pwdInput.click({ clickCount: 3 });
            await pwdInput.type('sentinel');
            const loginBtn = await p.$('button[type="submit"], button.ant-btn-primary');
            if (loginBtn) await loginBtn.click();
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      } catch(e) {}
    }}
  );

  // 2b. Sentinel 规则列表
  results.sentinel_rules = await takeScreenshot(page,
    'http://localhost:8085/#/dashboard/flow/order-service',
    '04-sentinel-flow-rules.png',
    { wait: 3000 }
  );

  // 3. Zipkin UI
  results.zipkin = await takeScreenshot(page,
    'http://localhost:9411/zipkin/',
    '05-zipkin-ui.png',
    { wait: 3000 }
  );

  // ========== 终端验证截图 (通过 API 返回内容) ==========
  console.log('\n=== API 测试结果截图 ===');

  // 4. 图书列表（直连 book-service）
  results.book_list = await takeScreenshot(page,
    'http://localhost:8081/book/list?page=1&size=5',
    '06-book-list-direct.png',
    { wait: 1000 }
  );

  // 5. 图书列表（通过网关）
  results.book_list_gateway = await takeScreenshot(page,
    'http://localhost:8080/api/book/list?page=1&size=5',
    '07-book-list-gateway.png',
    { wait: 1000 }
  );

  // 6. Ribbon 负载均衡验证
  results.ribbon_1 = await takeScreenshot(page,
    'http://localhost:8080/api/book/instance',
    '08-ribbon-lb-1.png',
    { wait: 500 }
  );
  results.ribbon_2 = await takeScreenshot(page,
    'http://localhost:8080/api/book/instance',
    '09-ribbon-lb-2.png',
    { wait: 500 }
  );
  results.ribbon_3 = await takeScreenshot(page,
    'http://localhost:8080/api/book/instance',
    '10-ribbon-lb-3.png',
    { wait: 500 }
  );

  // 7. 用户登录
  await page.goto('http://localhost:8082/user/login?username=admin&password=123456', { waitUntil: 'networkidle2', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));
  // POST 方式
  results.user_login = await takeScreenshot(page,
    'http://localhost:8082/user/login?username=admin&password=123456',
    '11-user-login.png',
    { wait: 1000 }
  );

  // 8. 创建订单 - 使用 Node.js HTTP 请求获取数据再渲染到页面
  const orderData = await new Promise((resolve) => {
    const http = require('http');
    const postData = JSON.stringify({
      userId: 1, bookId: 2, quantity: 1,
      receiverName: '管理员', receiverPhone: '13800138000',
      receiverAddress: '北京市朝阳区'
    });
    const req = http.request('http://localhost:8083/order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData)}
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    });
    req.on('error', e => resolve({ status: 'error', data: e.message }));
    req.write(postData);
    req.end();
  });
  await page.setContent(`<html><body style="background:#fff;font-family:monospace;padding:20px;">
    <h3>创建订单结果</h3>
    <p>POST http://localhost:8083/order</p>
    <pre style="background:#f5f5f5;padding:20px;border-radius:8px;border:1px solid #ddd;overflow:auto;">
${JSON.stringify(JSON.parse(orderData.data || '{}'), null, 2)}</pre>
  </body></html>`);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-create-order.png') });
  console.log('  ✓ Saved: 12-create-order.png');

  // 8b. 验证库存扣减
  results.stock_check = await takeScreenshot(page,
    'http://localhost:8081/book/2',
    '13-stock-after-order.png',
    { wait: 1000 }
  );

  // 9. Feign 调用：用户订单查询
  results.feign_orders = await takeScreenshot(page,
    'http://localhost:8082/user/1/orders',
    '14-user-orders-via-feign.png',
    { wait: 1000 }
  );

  // 10. 评价列表
  results.evaluation = await takeScreenshot(page,
    'http://localhost:8084/evaluation/book/1',
    '15-evaluation-list.png',
    { wait: 1000 }
  );

  // 11. 地址列表
  results.address = await takeScreenshot(page,
    'http://localhost:8082/address/user/1',
    '16-address-list.png',
    { wait: 1000 }
  );

  // 12. 网关鉴权 - 非白名单 (应该返回 401)
  results.auth_fail = await takeScreenshot(page,
    'http://localhost:8080/api/order',
    '17-gateway-auth-fail.png',
    { wait: 1000 }
  );

  // 12b. 网关鉴权 - 白名单 (应该返回 200)
  results.auth_pass = await takeScreenshot(page,
    'http://localhost:8080/api/book/list?page=1',
    '18-gateway-auth-pass.png',
    { wait: 1000 }
  );

  // 13. Sentinel 限流测试 - 使用 Node.js HTTP 请求避免 CORS
  const sentinelResults = [];
  const http2 = require('http');
  for (let i = 0; i < 15; i++) {
    try {
      await new Promise((resolve => {
        const postData = JSON.stringify({
          userId: 1, bookId: 3, quantity: 1,
          receiverName: 'test', receiverPhone: '13800138000',
          receiverAddress: 'test'
        });
        const req = http2.request('http://localhost:8083/order', {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData)}
        }, res => {
          let d = '';
          res.on('data', chunk => d += chunk);
          res.on('end', () => {
            sentinelResults.push({ idx: i+1, status: res.statusCode, body: d.substring(0,100) });
            resolve();
          });
        });
        req.on('error', e => {
          sentinelResults.push({ idx: i+1, status: 'error', body: e.message });
          resolve();
        });
        req.write(postData);
        req.end();
      }));
    } catch(e) {
      sentinelResults.push({ idx: i+1, status: 'error', body: e.message });
    }
  }
  await page.setContent(`<html><body style="background:#fff;font-family:monospace;padding:20px;">
    <h3>Sentinel 限流测试结果</h3>
    <p style="color:#666">快速请求15次 createOrder（限流 QPS=10）</p>
    <table style="border-collapse:collapse;width:100%;max-width:700px;">
      <tr style="background:#333;color:white;">
        <th style="padding:8px;border:1px solid #ddd;">请求序号</th>
        <th style="padding:8px;border:1px solid #ddd;">HTTP 状态码</th>
        <th style="padding:8px;border:1px solid #ddd;">结果</th>
      </tr>
      ${sentinelResults.map(r => {
        const bg = r.status===200?'#e8f5e9':r.status===429?'#ffebee':'#fff3e0';
        const label = r.status===200?'✅ 成功':r.status===429?'🚫 限流':'⚠️ 错误';
        return `<tr style="background:${bg}"><td style="padding:8px;border:1px solid #ddd;text-align:center;">#${r.idx}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${r.status}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${label}</td></tr>`;
      }).join('')}
    </table>
    <p style="margin-top:20px;color:#666;">前10次应返回 200（成功），超过10QPS后应返回 429（限流）</p>
  </body></html>`);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19-sentinel-rate-limit.png') });
  console.log('  ✓ Saved: 19-sentinel-rate-limit.png');

  // ========== 前端页面截图 ==========
  console.log('\n=== 前端页面截图 ===');

  // 检查前端页面是否存在
  const frontendPath = 'D:/Code/projects/bookstore/frontend/index.html';
  if (fs.existsSync(frontendPath)) {
    const fileUrl = 'file:///' + frontendPath.replace(/\\/g, '/');
    results.frontend_home = await takeScreenshot(page,
      fileUrl,
      '20-frontend-home.png',
      { wait: 2000 }
    );
  } else {
    console.log('  Frontend not found at:', frontendPath);
  }

  // ========== 汇总结果 ==========
  console.log('\n========== 截图汇总 ==========');
  const success = Object.values(results).filter(v => v).length;
  const total = Object.keys(results).length;
  console.log(`成功: ${success}/${total}`);
  Object.entries(results).forEach(([k, v]) => {
    console.log(`  ${v ? '✓' : '✗'} ${k}`);
  });

  await browser.close();
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
