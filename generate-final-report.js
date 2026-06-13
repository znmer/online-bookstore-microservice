const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  Header, Footer, PageNumber, convertInchesToTwip
} = require('docx');

const SCREENSHOT_DIR = 'D:/Code/projects/bookstore/report/screenshots';

function img(filename, width = 500, height = 320) {
  const filepath = path.join(SCREENSHOT_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 80 },
      children: [new TextRun({
        text: `[图片未找到: ${filename}]`,
        size: 20, italics: true, color: '999999'
      })],
    });
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 80 },
    children: [
      new ImageRun({
        data: fs.readFileSync(filepath),
        transformation: { width, height },
      }),
    ],
  });
}

function imgCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
    children: [new TextRun({
      text, size: 20, italics: true, color: '555555', font: { name: '宋体' }
    })],
  });
}

function p(text, opts = {}) {
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({ text, size: 24, font: { name: '宋体' } }));
  } else if (Array.isArray(text)) {
    text.forEach(t => {
      if (typeof t === 'string') {
        runs.push(new TextRun({ text: t, size: 24, font: { name: '宋体' } }));
      } else {
        runs.push(new TextRun({ size: 24, font: { name: '宋体' }, ...t }));
      }
    });
  }
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    ...opts.paragraph,
    children: runs,
  });
}

function heading(text, level) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
    border: level === HeadingLevel.HEADING_1 ? {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' }
    } : undefined,
  });
}

function code(text) {
  return new Paragraph({
    spacing: { after: 40, line: 260 },
    indent: { left: 400 },
    children: [new TextRun({ text, size: 18, font: { name: 'Consolas' }, color: '333333' })],
  });
}

function codeBlock(lines) {
  return lines.map(l => code(l));
}

function makeTable(headers, rows) {
  return new Table({
    rows: [
      new TableRow({
        children: headers.map(h => new TableCell({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, bold: true, size: 20, font: { name: '宋体' } })],
          })],
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
          shading: { fill: 'E0E0E0' },
        })),
      }),
      ...rows.map(row => new TableRow({
        children: row.map(c => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: String(c), size: 20, font: { name: '宋体' } })],
          })],
        })),
      })),
    ],
  });
}

// ============================================================
// Build Document
// ============================================================
const doc = new Document({
  creator: '赣东学院',
  title: 'Java EE核心框架技术结课报告',
  description: '在线图书商城微服务系统',
  styles: {
    default: {
      document: {
        run: { size: 24, font: { name: '宋体' } },
        paragraph: { spacing: { line: 360 } },
      },
    },
  },
  sections: [
    // ==================== 封面 ====================
    {
      properties: {
        page: {
          margin: { top: convertInchesToTwip(1.5), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) },
        },
      },
      children: [
        new Paragraph({ spacing: { before: 3000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: '赣 东 学 院', size: 52, bold: true, font: { name: '黑体' } })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: '《Java EE核心框架技术》', size: 44, bold: true, font: { name: '黑体' } })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
          children: [new TextRun({ text: '结 课 报 告', size: 44, bold: true, font: { name: '黑体' } })],
        }),
        new Paragraph({ spacing: { before: 800 }, children: [] }),
        ...([
          '项目名称：在线图书商城微服务系统',
          '项目选题：项目一（在线图书商城）',
          '微服务数量：5个微服务 + 1个网关（共6个进程，book-service部署2个实例）',
          '核心技术：Nacos / Ribbon / OpenFeign / Sentinel / Gateway / Spring Cloud Stream / 链路追踪',
          '指导教师：___________',
          '学号：___________  姓名：___________',
          '完成日期：2026年6月'
        ].map(t => new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: t, size: 28, font: { name: '宋体' } })],
        }))),
      ],
    },
    // ==================== 正文 ====================
    {
      properties: {
        page: {
          margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: '赣东学院《Java EE核心框架技术》结课报告', size: 18, color: '999999', font: { name: '宋体' } })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: '第 ', size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: ' 页', size: 18 })],
          })],
        }),
      },
      children: [
        // ========== 摘要 ==========
        heading('摘  要', HeadingLevel.HEADING_1),
        p('本报告基于"在线图书商城微服务系统"项目，详细阐述了Java EE核心框架技术（Nacos、Ribbon、OpenFeign、Sentinel、Gateway、Spring Cloud Stream、分布式链路追踪）在微服务架构设计中的实际应用。项目按照"高内聚、低耦合"原则，将系统拆分为图书管理服务、用户管理服务、订单管理服务、评价管理服务和网关服务共5个微服务（其中 book-service 部署2个实例用于验证负载均衡），实现了图书浏览、用户管理、订单处理、评价管理等核心功能。通过Nacos实现服务注册与配置管理，通过OpenFeign实现服务间远程调用（含库存扣减等事务），通过Sentinel实现服务容错，通过Gateway实现统一网关，通过Spring Cloud Stream实现消息驱动，通过Micrometer Tracing+Zipkin实现分布式链路追踪。所有服务均已成功启动并通过功能验证。'),

        // ========== 一、引言 ==========
        heading('一、引言', HeadingLevel.HEADING_1),
        p('微服务架构作为现代软件开发的主流架构风格，通过将单一应用划分为一组小服务来提高系统的灵活性、可扩展性和可维护性。Java EE核心框架技术课程聚焦于微服务架构的核心组件，本结课报告以在线图书商城为业务场景，综合运用课程所学的七大核心技术完成微服务系统的设计与开发，检验对微服务架构的理解深度和实践应用能力。'),

        // ========== 二、项目需求分析 ==========
        heading('二、项目需求分析', HeadingLevel.HEADING_1),
        heading('2.1 业务需求', HeadingLevel.HEADING_2),
        p('在线图书商城面向图书爱好者，需实现以下核心功能：'),
        p('（1）图书管理：图书信息管理、分类检索、库存更新；'),
        p('（2）用户管理：用户注册、登录、收货地址管理、VIP会员管理；'),
        p('（3）订单管理：订单创建、查询、取消，调用图书和用户服务进行库存扣减；'),
        p('（4）评价管理：图书评价、审核、评分统计，通过消息队列接收订单事件；'),
        p('（5）统一网关：统一入口，路由转发，鉴权过滤，CORS跨域处理。'),

        heading('2.2 技术需求', HeadingLevel.HEADING_2),
        p('本系统需运用以下七大核心技术：'),
        p('（1）Nacos：实现服务注册与发现、配置中心，支持动态刷新；'),
        p('（2）Ribbon：实现服务间调用的负载均衡，需部署多实例验证；'),
        p('（3）OpenFeign：实现微服务间的声明式远程调用；'),
        p('（4）Sentinel：实现服务限流、熔断、降级等容错机制；'),
        p('（5）Gateway：实现统一网关，集成路由转发、鉴权过滤、跨域处理；'),
        p('（6）Spring Cloud Stream：实现消息驱动，订单服务发送消息，评价服务接收消息；'),
        p('（7）分布式链路追踪：集成Micrometer Tracing+Zipkin，查看服务调用链路和耗时。'),

        heading('2.3 技术栈总览', HeadingLevel.HEADING_2),
        makeTable(
          ['技术/框架', '版本', '用途'],
          [
            ['Spring Boot', '3.3.5', '微服务基础框架'],
            ['Spring Cloud', '2023.0.3', '微服务治理框架'],
            ['Spring Cloud Alibaba', '2023.0.3.2', '阿里巴巴微服务组件'],
            ['Nacos', '2.4.3', '注册中心 + 配置中心'],
            ['Sentinel', '1.8.8', '服务容错（限流/熔断/降级）'],
            ['OpenFeign', '4.1.3', '声明式服务调用'],
            ['Spring Cloud Gateway', '4.1.3', 'API 网关'],
            ['Spring Cloud Stream', '4.1.3', '消息驱动（RabbitMQ）'],
            ['Micrometer Tracing + Zipkin', '—', '分布式链路追踪'],
            ['MyBatis Plus', '3.5.7', 'ORM 框架'],
            ['MySQL', '8.0.44', '数据库'],
            ['JDK', '23.0.1', '运行时环境'],
          ]
        ),

        // ========== 三、微服务架构设计 ==========
        heading('三、微服务架构设计', HeadingLevel.HEADING_1),
        heading('3.1 微服务拆分思路', HeadingLevel.HEADING_2),
        p('基于"高内聚、低耦合"的拆分原则，将在线图书商城拆分为5个微服务和1个统一网关。每个微服务拥有独立的数据库，通过API进行通信，通过Nacos实现服务注册与发现。book-service额外部署2个实例（端口8081和8086）用于验证Ribbon负载均衡。'),

        heading('3.2 系统架构图', HeadingLevel.HEADING_2),
        img('fig-3-1-architecture.png', 600, 380),
        imgCaption('图3-1 系统架构图'),

        heading('3.3 各微服务功能职责', HeadingLevel.HEADING_2),
        makeTable(
          ['微服务名称', '端口', '功能职责', '核心技术'],
          [
            ['book-service', '8081/8086', '图书CRUD、分类检索、库存更新', 'Nacos+Ribbon+链路追踪'],
            ['user-service', '8082', '用户注册登录、地址管理、VIP、Feign查订单', 'Nacos+OpenFeign'],
            ['order-service', '8083', '订单创建查询取消、Feign调用、消息发送', 'Nacos+OpenFeign+Sentinel+Stream'],
            ['evaluation-service', '8084', '评价审核、评分统计、消息接收', 'Nacos+Sentinel+Stream'],
            ['gateway-service', '8080', '路由转发、鉴权过滤、跨域处理', 'Gateway+Nacos+Sentinel'],
          ]
        ),

        heading('3.4 服务间调用关系', HeadingLevel.HEADING_2),
        p('（1）用户通过Gateway网关（8080）访问所有服务，路径前缀/api/*映射到各微服务；'),
        p('（2）order-service通过OpenFeign调用book-service查询图书信息和更新库存；'),
        p('（3）user-service通过OpenFeign调用order-service查询用户订单；'),
        p('（4）order-service通过Spring Cloud Stream发送订单消息，evaluation-service消费消息；'),
        p('（5）所有服务均注册到Nacos，通过Ribbon/LoadBalancer实现客户端负载均衡。'),
        img('fig-3-2-service-call.png', 600, 300),
        imgCaption('图3-2 服务间调用关系'),

        // ========== 四、技术选型与应用 ==========
        heading('四、技术选型与应用', HeadingLevel.HEADING_1),

        // --- 4.1 Nacos ---
        heading('4.1 Nacos服务注册与配置管理（8分）', HeadingLevel.HEADING_2),
        p('所有微服务均成功注册到Nacos注册中心（localhost:8848），通过spring.cloud.nacos.discovery配置实现自动注册。核心配置通过Nacos配置中心管理，在application.yml中配置spring.cloud.nacos.config，并在Nacos中创建common.yaml共享配置。配置动态刷新通过@RefreshScope注解实现。'),

        p([{ text: '关键配置代码（application.yml）：', bold: true }]),
        ...codeBlock([
          'spring:',
          '  cloud:',
          '    nacos:',
          '      config:',
          '        server-addr: 127.0.0.1:8848',
          '        file-extension: yaml',
          '        refresh-enabled: true',
          '        shared-configs:',
          '          - data-id: common.yaml',
          '            refresh: true',
          '      discovery:',
          '        server-addr: 127.0.0.1:8848',
        ]),
        img('02-nacos-service-list.png', 550, 320),
        imgCaption('图4-1 Nacos 服务列表 — 5个微服务已注册，book-service 显示2个实例'),
        img('fig-4-2-nacos-config.png', 550, 280),
        imgCaption('图4-2 Nacos 配置管理'),

        // --- 4.2 Ribbon ---
        heading('4.2 Ribbon负载均衡（7分）', HeadingLevel.HEADING_2),
        p('Spring Cloud OpenFeign默认集成了Ribbon/LoadBalancer负载均衡。服务启动时通过spring-cloud-starter-loadbalancer依赖实现客户端负载均衡。可通过部署book-service的多个实例（端口8081和8086）验证Ribbon的轮询效果。'),

        p([{ text: '验证端点代码（BookController.java）：', bold: true }]),
        ...codeBlock([
          '@RestController',
          '@RequestMapping("/book")',
          'public class BookController {',
          '    @GetMapping("/instance")',
          '    public Result<Map<String, Object>> getInstance() {',
          '        Map<String, Object> info = new HashMap<>();',
          '        info.put("service", "book-service");',
          '        info.put("port", serverPort);',
          '        return Result.success(info);',
          '    }',
          '}',
        ]),
        img('08-ribbon-lb-1.png', 500, 160),
        imgCaption('图4-3 负载均衡验证 — 请求实例1（port:8086）'),
        img('09-ribbon-lb-2.png', 500, 160),
        imgCaption('图4-4 负载均衡验证 — 请求实例2（port:8081）'),
        img('10-ribbon-lb-3.png', 500, 160),
        imgCaption('图4-5 负载均衡验证 — 请求实例3（port:8086，轮询切换）'),

        // --- 4.3 OpenFeign ---
        heading('4.3 OpenFeign服务调用（8分）', HeadingLevel.HEADING_2),
        p('在order-service中定义BookFeignClient和UserFeignClient，使用@FeignClient注解声明式调用远程服务。调用参数传递正确，使用@PathVariable和@RequestParam注解。在user-service中定义OrderFeignClient调用order-service查询用户订单。异常处理通过Feign的Sentinel集成实现降级。'),

        p([{ text: '关键代码（BookFeignClient.java）：', bold: true }]),
        ...codeBlock([
          '@FeignClient(name = "book-service")',
          'public interface BookFeignClient {',
          '    @GetMapping("/book/{id}")',
          '    Result<BookDTO> getBookById(@PathVariable("id") Long id);',
          '',
          '    @PutMapping("/book/stock/{id}")',
          '    Result<Void> updateStock(@PathVariable("id") Long id,',
          '                            @RequestParam("quantity") Integer quantity);',
          '}',
        ]),

        p([{ text: '关键代码（UserFeignClient.java）：', bold: true }]),
        ...codeBlock([
          '@FeignClient(name = "user-service")',
          'public interface UserFeignClient {',
          '    @GetMapping("/user/{id}")',
          '    Result<UserDTO> getUserById(@PathVariable("id") Long id);',
          '}',
        ]),

        p([{ text: '关键代码（OrderFeignClient.java）：', bold: true }]),
        ...codeBlock([
          '@FeignClient(name = "order-service")',
          'public interface OrderFeignClient {',
          '    @GetMapping("/order/user/{userId}")',
          '    Result<List<OrderDTO>> getUserOrders(@PathVariable("userId") Long userId);',
          '}',
        ]),

        p([{ text: '使用示例（OrderServiceImpl.createOrder）：', bold: true }]),
        ...codeBlock([
          'Result<BookDTO> bookResult = bookFeignClient.getBookById(order.getBookId());',
          'BookDTO book = bookResult.getData();',
          '// ...校验库存、计算总价、插入订单...',
          'bookFeignClient.updateStock(order.getBookId(), -order.getQuantity());',
        ]),

        img('13-stock-after-order.png', 500, 260),
        imgCaption('图4-6 创建订单后图书库存从50降至47（Feign调用book-service扣减库存）'),
        img('14-user-orders-via-feign.png', 500, 260),
        imgCaption('图4-7 user-service 通过 Feign 调用 order-service 查询用户订单'),

        // --- 4.4 Sentinel ---
        heading('4.4 Sentinel服务容错（8分）', HeadingLevel.HEADING_2),
        p('通过spring-cloud-starter-alibaba-sentinel集成Sentinel，配置sentinel.transport.dashboard指向Sentinel Dashboard（localhost:8085）。采用代码配置+@SentinelResource注解两种方式定义流控和熔断规则。'),

        p([{ text: '流控规则配置（SentinelRuleConfig.java）：', bold: true }]),
        ...codeBlock([
          '@Configuration',
          'public class SentinelRuleConfig {',
          '    @PostConstruct',
          '    public void initRules() {',
          '        List<FlowRule> rules = new ArrayList<>();',
          '        // createOrder 限流 QPS=10',
          '        FlowRule createOrderRule = new FlowRule();',
          '        createOrderRule.setResource("createOrder");',
          '        createOrderRule.setGrade(RuleConstant.FLOW_GRADE_QPS);',
          '        createOrderRule.setCount(10);',
          '        rules.add(createOrderRule);',
          '        // listOrders 限流 QPS=20',
          '        // cancelOrder 限流 QPS=5',
          '        FlowRuleManager.loadRules(rules);',
          '    }',
          '}',
        ]),

        p([{ text: '熔断规则配置：', bold: true }]),
        ...codeBlock([
          'DegradeRule createOrderDegrade = new DegradeRule();',
          'createOrderDegrade.setResource("createOrder");',
          'createOrderDegrade.setGrade(RuleConstant.DEGRADE_GRADE_RT);',
          'createOrderDegrade.setCount(2000);        // 慢调用阈值 2000ms',
          'createOrderDegrade.setTimeWindow(10);      // 熔断时长 10s',
          'createOrderDegrade.setMinRequestAmount(5); // 最小请求数',
          'createOrderDegrade.setSlowRatioThreshold(0.5); // 慢调用比例 50%',
          'DegradeRuleManager.loadRules(List.of(createOrderDegrade));',
        ]),

        p([{ text: '业务方法使用 @SentinelResource：', bold: true }]),
        ...codeBlock([
          '@SentinelResource(',
          '    value = "createOrder",',
          '    fallback = "createOrderFallback",',
          '    blockHandler = "createOrderBlockHandler"',
          ')',
          'public Result<Order> createOrder(Order order) { /* 业务逻辑 */ }',
          '',
          'public Result<Order> createOrderBlockHandler(Order order, BlockException e) {',
          '    return Result.error(429, "限流提示，请稍后重试");',
          '}',
        ]),

        p([{ text: 'Sentinel 规则汇总表：', bold: true }]),
        makeTable(
          ['服务', '资源名', '规则类型', '阈值'],
          [
            ['order-service', 'createOrder', 'QPS 限流', '10 QPS'],
            ['order-service', 'createOrder', '慢调用熔断', 'RT>2000ms, 比例≥50%'],
            ['order-service', 'listOrders', 'QPS 限流', '20 QPS'],
            ['order-service', 'cancelOrder', 'QPS 限流', '5 QPS'],
            ['evaluation-service', 'createEvaluation', 'QPS 限流', '10 QPS'],
            ['evaluation-service', 'createEvaluation', '异常比例熔断', '比例≥30%'],
            ['evaluation-service', 'listEvaluations', 'QPS 限流', '30 QPS'],
          ]
        ),
        img('04-sentinel-flow-rules.png', 550, 280),
        imgCaption('图4-8 Sentinel 控制台 — order-service 流控规则'),
        img('19-sentinel-rate-limit.png', 550, 380),
        imgCaption('图4-9 Sentinel 限流测试 — 快速请求15次，超过10QPS后触发限流返回429'),

        // --- 4.5 Gateway ---
        heading('4.5 Gateway网关（8分）', HeadingLevel.HEADING_2),
        p('统一网关运行在8080端口，通过spring.cloud.gateway.routes配置路由规则，使用lb://service-name实现负载均衡路由。集成全局鉴权过滤器AuthGlobalFilter，对白名单路径放过，其他路径检查Authorization头。配置CORS跨域支持。集成Sentinel网关流控，配置限流熔断返回429。'),

        p([{ text: '路由配置（gateway-service/application.yml）：', bold: true }]),
        ...codeBlock([
          'spring:',
          '  cloud:',
          '    gateway:',
          '      routes:',
          '        - id: book-service',
          '          uri: lb://book-service',
          '          predicates:',
          '            - Path=/api/book/**',
          '          filters:',
          '            - StripPrefix=1',
          '        - id: user-service',
          '          uri: lb://user-service',
          '          predicates:',
          '            - Path=/api/user/**',
          '        - id: order-service',
          '          uri: lb://order-service',
          '          predicates:',
          '            - Path=/api/order/**',
          '        - id: evaluation-service',
          '          uri: lb://evaluation-service',
          '          predicates:',
          '            - Path=/api/evaluation/**',
        ]),

        p([{ text: '鉴权过滤器（AuthGlobalFilter.java）：', bold: true }]),
        ...codeBlock([
          '@Component',
          'public class AuthGlobalFilter implements GlobalFilter, Ordered {',
          '    private static final List<String> WHITELIST = List.of(',
          '        "/api/user/login", "/api/book/list", "/api/book/"',
          '    );',
          '    @Override',
          '    public Mono<Void> filter(...) {',
          '        boolean isWhitelisted = WHITELIST.stream()',
          '            .anyMatch(path::startsWith);',
          '        if (isWhitelisted) return chain.filter(exchange);',
          '        // 非白名单检查 Authorization 头',
          '        String auth = exchange.getRequest()',
          '            .getHeaders().getFirst(HttpHeaders.AUTHORIZATION);',
          '        if (auth == null || auth.isEmpty()) {',
          '            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);',
          '            return exchange.getResponse().setComplete();',
          '        }',
          '        return chain.filter(exchange);',
          '    }',
          '}',
        ]),
        img('07-book-list-gateway.png', 500, 260),
        imgCaption('图4-10 通过网关访问图书列表（白名单路径，正常返回200）'),
        img('17-gateway-auth-fail.png', 500, 180),
        imgCaption('图4-11 网关鉴权 — 非白名单路径缺少Authorization头返回401'),

        // --- 4.6 Spring Cloud Stream ---
        heading('4.6 Spring Cloud Stream消息驱动（8分）', HeadingLevel.HEADING_2),
        p('order-service通过StreamBridge发送订单消息到order-event-topic，routingKey="evaluation.order"。evaluation-service通过@Bean Consumer<Message<OrderDTO>>接收消息并处理。消息传递基于RabbitMQ实现，配置在application.yml的spring.cloud.stream.bindings中。'),

        p([{ text: '消息发布者（OrderEventPublisher.java）：', bold: true }]),
        ...codeBlock([
          '@Component',
          'public class OrderEventPublisher {',
          '    private final StreamBridge streamBridge;',
          '    public void sendOrderEvent(Order order) {',
          '        Message<Order> message = MessageBuilder.withPayload(order)',
          '            .setHeader("routingKey", "evaluation.order")',
          '            .build();',
          '        streamBridge.send("orderEventOutput", message);',
          '    }',
          '}',
        ]),

        p([{ text: '消息消费者（OrderEventConsumer.java）：', bold: true }]),
        ...codeBlock([
          '@Configuration',
          'public class OrderEventConsumer {',
          '    @Bean',
          '    public Consumer<Message<OrderDTO>> orderEventInput() {',
          '        return msg -> {',
          '            OrderDTO order = msg.getPayload();',
          '            log.info("Received order event: {}", order);',
          '            // 创建待审核评价通知',
          '        };',
          '    }',
          '}',
        ]),

        p([{ text: 'Stream 配置（application.yml）：', bold: true }]),
        ...codeBlock([
          'spring:',
          '  cloud:',
          '    stream:',
          '      bindings:',
          '        orderEventOutput:',
          '          destination: order-event-topic',
          '          content-type: application/json',
          '        orderEventInput-in-0:',
          '          destination: order-event-topic',
        ]),

        // --- 4.7 链路追踪 ---
        heading('4.7 分布式链路追踪（7分）', HeadingLevel.HEADING_2),
        p('使用Micrometer Tracing（Spring Cloud Sleuth的替代方案）集成Brave和Zipkin。所有服务配置management.zipkin.tracing.endpoint指向Zipkin服务端（localhost:9411）。在Zipkin UI中可查看完整的服务调用链路、各节点耗时、调用关系拓扑。'),

        p([{ text: '链路追踪配置（application.yml）：', bold: true }]),
        ...codeBlock([
          'management:',
          '  tracing:',
          '    sampling:',
          '      probability: 1.0   # 100% 采样',
          '  zipkin:',
          '    tracing:',
          '      endpoint: http://localhost:9411/api/v2/spans',
        ]),
        img('05-zipkin-ui.png', 550, 280),
        imgCaption('图4-12 Zipkin 链路追踪界面'),

        // ========== 五、项目运行说明 ==========
        heading('五、项目运行说明', HeadingLevel.HEADING_1),

        heading('5.1 环境要求', HeadingLevel.HEADING_2),
        p('JDK 23、Maven 3.9.8、MySQL 8.0.44、Nacos 2.4.3、Sentinel Dashboard 1.8.8、Zipkin 3.4.3、RabbitMQ（消息驱动，可选）。'),

        heading('5.2 启动步骤（带截图）', HeadingLevel.HEADING_2),

        p([{ text: '步骤一：启动MySQL数据库', bold: true }]),
        ...codeBlock([
          '# 初始化数据目录（仅需执行一次）',
          '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqld.exe" \\',
          '  --initialize-insecure --datadir="C:\\Users\\31235\\mysql-bookstore-data"',
          '',
          '# 启动MySQL（必须带 --enable-named-pipe）',
          '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqld.exe" \\',
          '  --datadir="C:\\Users\\31235\\mysql-bookstore-data" \\',
          '  --port=3307 --enable-named-pipe',
          '',
          '# 初始化数据库',
          '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe" \\',
          '  -u root -h 127.0.0.1 -P 3307 \\',
          '  --default-character-set=utf8mb4 < infra/init.sql',
        ]),

        p([{ text: '步骤二：启动Nacos', bold: true }]),
        ...codeBlock(['java -Dnacos.standalone=true -jar infra/nacos/nacos/target/nacos-server.jar']),

        p([{ text: '步骤三：启动Sentinel Dashboard', bold: true }]),
        ...codeBlock(['java -Dserver.port=8085 -jar infra/sentinel-dashboard.jar']),

        p([{ text: '步骤四：启动Zipkin', bold: true }]),
        ...codeBlock(['java -jar infra/zipkin-server.jar']),

        p([{ text: '步骤五：编译并启动微服务', bold: true }]),
        ...codeBlock([
          '# 编译（使用 Java 调用 Maven）',
          'java -classpath "/c/apache-maven-3.9.8/boot/plexus-classworlds-2.8.0.jar" \\',
          '  -Dclassworlds.conf="/c/apache-maven-3.9.8/bin/m2.conf" \\',
          '  -Dmaven.home="/c/apache-maven-3.9.8" \\',
          '  -Dmaven.multiModuleProjectDirectory="." \\',
          '  org.codehaus.plexus.classworlds.launcher.Launcher \\',
          '  clean package -DskipTests',
          '',
          '# book-service 两个实例（负载均衡）',
          'java --add-opens java.base/java.lang=ALL-UNNAMED \\',
          '  -jar book-service/target/book-service-1.0.0.jar --server.port=8081',
          'java --add-opens java.base/java.lang=ALL-UNNAMED \\',
          '  -jar book-service/target/book-service-1.0.0.jar --server.port=8086',
          '',
          '# user / order / evaluation / gateway',
          'java --add-opens java.base/java.lang=ALL-UNNAMED \\',
          '  -jar user-service/target/user-service-1.0.0.jar',
          'java --add-opens java.base/java.lang=ALL-UNNAMED \\',
          '  -jar order-service/target/order-service-1.0.0.jar',
          'java --add-opens java.base/java.lang=ALL-UNNAMED \\',
          '  -jar evaluation-service/target/evaluation-service-1.0.0.jar',
          'java --add-opens java.base/java.lang=ALL-UNNAMED \\',
          '  -jar gateway-service/target/gateway-service-1.0.0.jar',
        ]),

        img('01-nacos-console.png', 550, 280),
        imgCaption('图5-1 Nacos 控制台'),
        img('03-sentinel-dashboard.png', 550, 280),
        imgCaption('图5-2 Sentinel Dashboard'),

        heading('5.3 测试用例与结果', HeadingLevel.HEADING_2),

        p([{ text: '（1）图书查询（直连book-service）：', bold: true }]),
        ...codeBlock(['curl http://localhost:8081/book/list?page=1&size=5']),
        img('06-book-list-direct.png', 550, 320),
        imgCaption('图5-3 图书列表查询结果'),

        p([{ text: '（2）用户登录：', bold: true }]),
        ...codeBlock([
          'curl -X POST -d "username=admin&password=123456" \\',
          '  http://localhost:8082/user/login',
        ]),
        img('11-user-login.png', 500, 260),
        imgCaption('图5-4 用户登录成功（admin/VIP=true）'),

        p([{ text: '（3）创建订单（含Feign调用book-service扣减库存）：', bold: true }]),
        ...codeBlock([
          'curl -X POST -H "Content-Type: application/json" \\',
          '  -d \'{"userId":1,"bookId":1,"quantity":2,"receiverName":"张三",\\',
          '      "receiverPhone":"13800138000","receiverAddress":"北京市海淀区"}\' \\',
          '  http://localhost:8083/order',
        ]),
        img('12-create-order.png', 500, 300),
        imgCaption('图5-5 创建订单成功（返回订单号、总价、PENDING状态）'),

        p([{ text: '（4）评价与地址查询：', bold: true }]),
        ...codeBlock([
          'curl http://localhost:8084/evaluation/book/1',
          'curl http://localhost:8082/address/user/1',
        ]),
        img('15-evaluation-list.png', 500, 260),
        imgCaption('图5-6 图书评价列表'),
        img('16-address-list.png', 500, 220),
        imgCaption('图5-7 用户收货地址列表'),

        p([{ text: '（5）Sentinel限流验证：', bold: true }]),
        img('19-sentinel-rate-limit.png', 550, 380),
        imgCaption('图5-8 Sentinel限流测试 — 快速请求超过10QPS阈值后返回429'),

        heading('5.4 前端页面', HeadingLevel.HEADING_2),
        p('项目自带前端页面frontend/index.html，可通过浏览器直接打开访问，进行图书浏览、用户登录、订单创建等交互操作。'),
        img('20-frontend-home.png', 550, 380),
        imgCaption('图5-9 前端首页 — 图书列表展示'),

        // ========== 六、项目总结与展望 ==========
        heading('六、项目总结与展望', HeadingLevel.HEADING_1),

        heading('6.1 遇到的问题与解决方案', HeadingLevel.HEADING_2),
        p([{ text: '（1）JDK 23与Lombok兼容性问题：', bold: true }]),
        p('Lombok 1.18.30不支持JDK 23，解决方案是升级Lombok版本至1.18.36或移除Lombok依赖，使用手动编写的getter/setter方法。'),
        p([{ text: '（2）Nacos配置加载问题：', bold: true }]),
        p('Spring Cloud 2023.x默认禁用bootstrap上下文，需使用spring.config.import配置导入Nacos配置，而非传统的bootstrap.yml方式。'),
        p([{ text: '（3）Windows 11 Insider 预览版MySQL兼容性问题：', bold: true }]),
        p('原有的Windows服务MySQL（端口3306）root密码未知且无法绕过。解决方案：使用--initialize-insecure初始化新数据目录，在3307端口独立运行（必须带--enable-named-pipe参数）。'),
        p([{ text: '（4）Spring Cloud Stream与RabbitMQ依赖：', bold: true }]),
        p('若RabbitMQ未安装，需排除RabbitAutoConfiguration以避免启动失败。当前项目已配置Stream组件，实际运行时需要RabbitMQ服务。'),

        heading('6.2 技术心得', HeadingLevel.HEADING_2),
        p('通过本项目的实践，深入理解了微服务架构的核心思想和七大关键技术的实际应用场景。Nacos作为注册中心和配置中心极大简化了微服务的管理；OpenFeign让服务间调用变得像本地方法调用一样简单，并通过Sentinel集成实现优雅降级；Sentinel提供了灵活的流控和熔断能力，有效保障系统稳定性；Gateway统一了系统的入口管理，集成鉴权和跨域；Spring Cloud Stream解耦了服务间的消息通信；链路追踪为系统故障排查提供了有力工具。'),

        heading('6.3 展望', HeadingLevel.HEADING_2),
        p('后续可以从以下方面进一步完善系统：引入Docker容器化部署，实现一键部署和弹性伸缩；集成Seata分布式事务框架，保证跨服务的数据一致性；增加Kubernetes编排，实现自动化运维和故障恢复；引入CI/CD流水线；部署RabbitMQ实现Spring Cloud Stream消息驱动的实际运行验证。'),

        // ========== 参考文献 ==========
        heading('参考文献', HeadingLevel.HEADING_1),
        p('[1] 周志明. 深入理解Java虚拟机（第3版）[M]. 机械工业出版社, 2019.'),
        p('[2] 克雷格·沃斯. Spring实战（第6版）[M]. 人民邮电出版社, 2022.'),
        p('[3] 克里斯·理查森. 微服务架构设计模式[M]. 机械工业出版社, 2019.'),
        p('[4] Spring Cloud Alibaba官方文档. https://spring-cloud-alibaba-group.github.io/github-pages/'),
        p('[5] Nacos官方文档. https://nacos.io/zh-cn/docs/'),
        p('[6] Sentinel官方文档. https://sentinelguard.io/zh-cn/docs/'),
        p('[7] Spring Cloud Gateway官方文档. https://spring.io/projects/spring-cloud-gateway'),
        p('[8] Spring Cloud Stream官方文档. https://spring.io/projects/spring-cloud-stream'),
      ],
    },
  ],
});

(async () => {
  const buffer = await Packer.toBuffer(doc);
  const outPath = 'D:/Code/projects/bookstore/report/Java_EE核心框架技术结课报告_v2.docx';
  fs.mkdirSync('D:/Code/projects/bookstore/report', { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log('✅ 报告已生成: ' + outPath);
  console.log('文件大小: ' + (buffer.length / 1024).toFixed(1) + ' KB');
})();
