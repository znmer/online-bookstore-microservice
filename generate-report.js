const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  Header, Footer, PageNumber, NumberFormat, convertInchesToTwip,
  LevelFormat, TabStopPosition, TabStopType
} = require('docx');

// Helper function to create a styled paragraph
function p(text, options = {}) {
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({ text, size: 24, font: { name: '宋体' }, ...options }));
  } else if (Array.isArray(text)) {
    text.forEach(t => {
      if (typeof t === 'string') runs.push(new TextRun({ text: t, size: 24, font: { name: '宋体' } }));
      else runs.push(new TextRun({ size: 24, font: { name: '宋体' }, ...t }));
    });
  }
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    ...options.paragraph || {},
    children: runs,
  });
}

function heading(text, level) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
    border: level === HeadingLevel.HEADING_1 ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' } } : undefined,
  });
}

function code(text) {
  return new Paragraph({
    spacing: { after: 60, line: 276 },
    indent: { left: 400 },
    children: [new TextRun({ text, size: 20, font: { name: 'Consolas' }, color: '333333' })],
  });
}

// Build the document
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
  sections: [{
    // Title Page
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
      ...(['项目名称：在线图书商城微服务系统',
         '项目选题：项目一（在线图书商城）',
         '微服务数量：5个微服务 + 1个网关',
         '核心技术：Nacos / Ribbon / OpenFeign / Sentinel / Gateway / Spring Cloud Stream / 链路追踪',
         '指导教师：___________',
         '完成日期：2026年6月'].map(t => new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: t, size: 28, font: { name: '宋体' } })],
      }))),
    ],
  }, {
    // Main Content
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
      // 摘要
      heading('摘  要', HeadingLevel.HEADING_1),
      p('本报告基于"在线图书商城微服务系统"项目，详细阐述了Java EE核心框架技术（Nacos、Ribbon、OpenFeign、Sentinel、Gateway、Spring Cloud Stream、分布式链路追踪）在微服务架构设计中的实际应用。项目按照"高内聚、低耦合"原则，将系统拆分为图书管理服务、用户管理服务、订单管理服务、评价管理服务和网关服务共5个微服务，实现了图书浏览、用户管理、订单处理、评价管理等核心功能，并通过Nacos实现服务注册与配置管理，通过OpenFeign实现服务间远程调用，通过Sentinel实现服务容错，通过Gateway实现统一网关，通过Spring Cloud Stream实现消息驱动，通过Sleuth+Zipkin实现分布式链路追踪。'),

      // 引言
      heading('一、引言', HeadingLevel.HEADING_1),
      p('微服务架构作为现代软件开发的主流架构风格，通过将单一应用划分为一组小服务来提高系统的灵活性、可扩展性和可维护性。Java EE核心框架技术课程聚焦于微服务架构的核心组件，本结课报告以在线图书商城为业务场景，综合运用课程所学的七大核心技术完成微服务系统的设计与开发，检验对微服务架构的理解深度和实践应用能力。'),

      // 项目需求分析
      heading('二、项目需求分析', HeadingLevel.HEADING_1),
      heading('2.1 业务需求', HeadingLevel.HEADING_2),
      p('在线图书商城面向图书爱好者，需实现以下核心功能：'),
      p('（1）图书管理：图书信息管理、分类检索、库存更新；'),
      p('（2）用户管理：用户注册、登录、收货地址管理、会员管理；'),
      p('（3）订单管理：订单创建、查询、取消，调用图书和用户服务；'),
      p('（4）评价管理：图书评价、回复、审核、评分统计；'),
      p('（5）统一网关：统一入口，路由转发，鉴权过滤。'),

      heading('2.2 技术需求', HeadingLevel.HEADING_2),
      p('本系统需运用以下七大核心技术：'),
      p('（1）Nacos：实现服务注册与发现、配置中心，支持动态刷新；'),
      p('（2）Ribbon：实现服务间调用的负载均衡，需部署多实例验证；'),
      p('（3）OpenFeign：实现微服务间的声明式远程调用；'),
      p('（4）Sentinel：实现服务限流、熔断、降级等容错机制；'),
      p('（5）Gateway：实现统一网关，集成路由转发、鉴权过滤、跨域处理；'),
      p('（6）Spring Cloud Stream：实现消息驱动，订单服务发送消息，评价服务接收消息；'),
      p('（7）分布式链路追踪：集成Sleuth+Zipkin，查看服务调用链路和耗时。'),

      // 微服务架构设计
      heading('三、微服务架构设计', HeadingLevel.HEADING_1),
      heading('3.1 微服务拆分思路', HeadingLevel.HEADING_2),
      p('基于"高内聚、低耦合"的拆分原则，将在线图书商城拆分为5个微服务和1个统一网关。每个微服务拥有独立的数据库，通过API进行通信，通过Nacos实现服务注册与发现。'),

      heading('3.2 系统架构图', HeadingLevel.HEADING_2),
      p([{ text: '（注：此处应在报告中插入系统架构图，展示各微服务及技术组件的调用关系）', italics: true, color: '666666' }]),

      heading('3.3 各微服务功能职责', HeadingLevel.HEADING_2),

      // Architecture table
      new Table({
        rows: [
          new TableRow({ children: ['微服务名称', '端口', '功能职责', '核心技术'].map(h => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20 })] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: 'E0E0E0' },
          })) }),
          ...([
            ['book-service', '8081', '图书CRUD、分类检索、库存更新', 'Nacos+Ribbon+链路追踪'],
            ['user-service', '8082', '用户注册登录、地址管理、VIP', 'Nacos+OpenFeign'],
            ['order-service', '8083', '订单创建查询、Feign调用、消息发送', 'Nacos+OpenFeign+Sentinel+Stream'],
            ['evaluation-service', '8084', '评价审核、评分统计、消息接收', 'Nacos+Sentinel+Stream'],
            ['gateway-service', '8080', '路由转发、鉴权过滤、跨域处理', 'Gateway+Nacos+Sentinel'],
          ].map(row => new TableRow({
            children: row.map(c => new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: c, size: 20 })] })],
            })),
          }))),
        ],
      }),

      heading('3.4 服务间调用关系', HeadingLevel.HEADING_2),
      p('（1）用户通过Gateway网关（8080）访问所有服务，路径前缀/api/*映射到各微服务；'),
      p('（2）order-service通过OpenFeign调用book-service查询图书信息和更新库存；'),
      p('（3）user-service通过OpenFeign调用order-service查询用户订单；'),
      p('（4）order-service通过Spring Cloud Stream发送订单消息，evaluation-service消费消息；'),
      p('（5）所有服务均注册到Nacos，通过Ribbon实现客户端负载均衡。'),

      // 技术选型与应用
      heading('四、技术选型与应用', HeadingLevel.HEADING_1),

      heading('4.1 Nacos服务注册与配置管理（8分）', HeadingLevel.HEADING_2),
      p('所有微服务均成功注册到Nacos注册中心（localhost:8848），通过spring.cloud.nacos.discovery配置实现自动注册。核心配置通过Nacos配置中心管理，在application.yml中配置spring.cloud.nacos.config，并在Nacos中创建common.yaml共享配置。配置动态刷新通过@RefreshScope注解实现。'),

      heading('4.2 Ribbon负载均衡（7分）', HeadingLevel.HEADING_2),
      p('Spring Cloud OpenFeign默认集成了Ribbon负载均衡。服务启动时通过spring-cloud-starter-loadbalancer依赖实现客户端负载均衡。可通过部署book-service的多个实例（不同端口）验证Ribbon的轮询效果。'),

      heading('4.3 OpenFeign服务调用（8分）', HeadingLevel.HEADING_2),
      p('在order-service中定义BookFeignClient和UserFeignClient，使用@FeignClient(name="book-service")和@FeignClient(name="user-service")注解声明式调用远程服务。调用参数传递正确，使用@PathVariable和@RequestParam注解。异常处理通过Feign的Sentinel集成实现降级。'),

      p([{ text: '关键代码示例：', bold: true }]),
      code('@FeignClient(name = "book-service")'),
      code('public interface BookFeignClient {'),
      code('    @GetMapping("/book/{id}")'),
      code('    Result<BookDTO> getBookById(@PathVariable("id") Long id);'),
      code('    @PutMapping("/book/stock/{id}")'),
      code('    Result<Void> updateStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity);'),
      code('}'),

      heading('4.4 Sentinel服务容错（8分）', HeadingLevel.HEADING_2),
      p('通过spring-cloud-starter-alibaba-sentinel集成Sentinel，配置sentinel.transport.dashboard指向Sentinel Dashboard（localhost:8085）。在Sentinel控制台中可对order-service的查询、下单接口配置限流和熔断规则。网关服务也集成了Sentinel网关流控。'),

      heading('4.5 Gateway网关（8分）', HeadingLevel.HEADING_2),
      p('统一网关运行在8080端口，通过spring.cloud.gateway.routes配置路由规则，使用lb://service-name实现负载均衡路由。集成全局鉴权过滤器AuthGlobalFilter，对白名单路径放过，其他路径检查Authorization头。配置CORS跨域支持。集成Sentinel网关流控，配置限流熔断。'),

      heading('4.6 Spring Cloud Stream消息驱动（8分）', HeadingLevel.HEADING_2),
      p('order-service通过StreamBridge发送订单消息到order-event-topic，routingKey="evaluation.order"。evaluation-service通过@Bean Consumer<Message<OrderDTO>>接收消息并处理。消息传递基于RabbitMQ实现，配置在application.yml的spring.cloud.stream.bindings中。'),

      heading('4.7 分布式链路追踪（7分）', HeadingLevel.HEADING_2),
      p('使用Micrometer Tracing（Spring Cloud Sleuth的替代方案）集成Brave和Zipkin。所有服务配置management.zipkin.tracing.endpoint指向Zipkin服务端（localhost:9411）。在Zipkin UI中可查看完整的服务调用链路、各节点耗时、调用关系拓扑。'),

      // 项目运行与演示
      heading('五、项目运行说明', HeadingLevel.HEADING_1),

      heading('5.1 环境要求', HeadingLevel.HEADING_2),
      p('JDK 23、Maven 3.9.8、MySQL 8.0、Nacos 2.4.3、Sentinel Dashboard 1.8.8、Zipkin 3.4.3、RabbitMQ（可选）。'),

      heading('5.2 启动步骤', HeadingLevel.HEADING_2),
      p('步骤一：启动MySQL数据库，执行infra/init.sql初始化数据库和测试数据；'),
      p('步骤二：启动Nacos（http://localhost:8848）作为注册中心和配置中心；'),
      p('步骤三：启动Sentinel Dashboard（http://localhost:8085）作为流控控制台；'),
      p('步骤四：启动Zipkin（http://localhost:9411）作为链路追踪服务端；'),
      p('步骤五：依次启动book-service（8081）、user-service（8082）、order-service（8083）、evaluation-service（8084）、gateway-service（8080）；'),
      p('步骤六：通过Gateway（http://localhost:8080）访问各服务API，在Nacos控制台验证服务注册状态。'),

      heading('5.3 测试用例', HeadingLevel.HEADING_2),
      p('（1）图书查询：GET http://localhost:8081/book/list?page=1&size=10  → 返回10本图书数据；'),
      p('（2）用户登录：POST http://localhost:8082/user/login?username=admin&password=123456 → 返回用户信息；'),
      p('（3）创建订单：POST http://localhost:8083/order → 返回订单信息，扣减库存；'),
      p('（4）评价查询：GET http://localhost:8084/evaluation/book/1 → 返回图书评价列表；'),
      p('（5）网关路由：GET http://localhost:8080/api/book/list?page=1&size=5 → 网关转发到图书服务；'),
      p('（6）Feign调用：GET http://localhost:8082/user/1/orders → 通过Feign调用order-service获取用户订单。'),

      // 总结与展望
      heading('六、项目总结与展望', HeadingLevel.HEADING_1),

      heading('6.1 遇到的问题与解决方案', HeadingLevel.HEADING_2),
      p('（1）JDK 23与Lombok兼容性问题：Lombok 1.18.30不支持JDK 23，解决方案是升级Lombok版本至1.18.36或移除Lombok依赖，使用手动编写的getter/setter方法；'),
      p('（2）Nacos配置加载问题：Spring Cloud 2023.x默认禁用bootstrap上下文，需使用spring.config.import配置导入Nacos配置，而非传统的bootstrap.yml方式；'),
      p('（3）Spring Cloud Stream与RabbitMQ依赖：若RabbitMQ未安装，需排除RabbitAutoConfiguration以避免启动失败。'),

      heading('6.2 技术心得', HeadingLevel.HEADING_2),
      p('通过本项目的实践，深入理解了微服务架构的核心思想和七大关键技术的实际应用场景。Nacos作为注册中心和配置中心极大简化了微服务的管理；OpenFeign让服务间调用变得像本地方法调用一样简单；Sentinel提供了灵活的流控和熔断能力；Gateway统一了系统的入口管理；Spring Cloud Stream解耦了服务间的消息通信；链路追踪为系统故障排查提供了有力工具。架构设计中的"高内聚、低耦合"原则，确保每个服务专注于单一业务领域，独立开发、部署和扩展。'),

      heading('6.3 展望', HeadingLevel.HEADING_2),
      p('后续可以从以下方面进一步完善系统：引入Docker容器化部署，实现一键部署和弹性伸缩；集成Seata分布式事务框架，保证跨服务的数据一致性；增加Kubernetes编排，实现自动化运维和故障恢复；引入CI/CD流水线，实现持续集成和持续交付；增加更多业务功能如购物车、优惠券、推荐系统等。'),

      // 参考文献
      heading('参考文献', HeadingLevel.HEADING_1),
      p('[1] 周志明. 深入理解Java虚拟机（第3版）[M]. 机械工业出版社, 2019.'),
      p('[2] 克雷格·沃斯. Spring实战（第6版）[M]. 人民邮电出版社, 2022.'),
      p('[3] 克里斯·理查森. 微服务架构设计模式[M]. 机械工业出版社, 2019.'),
      p('[4] Spring Cloud Alibaba官方文档. https://spring-cloud-alibaba-group.github.io/github-pages/'),
      p('[5] Nacos官方文档. https://nacos.io/zh-cn/docs/'),
      p('[6] Sentinel官方文档. https://sentinelguard.io/zh-cn/docs/'),
    ],
  }],
});

(async () => {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('D:/Projects/bookstore/Java_EE核心框架技术结课报告.docx', buffer);
  console.log('✅ Report generated: Java_EE核心框架技术结课报告.docx (' + (buffer.length / 1024).toFixed(0) + ' KB)');
})();
