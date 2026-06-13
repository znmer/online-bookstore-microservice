const fs = require("fs");
const cp = require("child_process");

const ps1Path = "C:\\Users\\31235\\g.ps1";

// Build PS1 script line by line
const lines = [];

function a(s) { lines.push(s); }
function p(t, indent) {
  lines.push('  $selection.TypeText("' + esc(t) + '"); $selection.TypeParagraph()');
}
function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}
function code(s) {
  lines.push('  C(@"');
  for (const line of s.split("\n")) {
    lines.push(line);
  }
  lines.push('"@)');
}
function ss(desc) {
  lines.push('  S("' + esc(desc) + '")');
}
function fig(text) {
  lines.push('  F("' + esc(text) + '")');
}
function h1(text) {
  lines.push('B');
  lines.push('HD("' + esc(text) + '") 1');
}
function h2(text) {
  lines.push('HD("' + esc(text) + '") 2');
}
function h3(text) {
  lines.push('HD("' + esc(text) + '") 3');
}
function para(text) {
  p(text, true);
}
function paraNI(text) {
  p(text, false);
}
function tbl(rows, headers) {
  const h = headers.map(x => '"' + esc(x) + '"').join(",");
  const r = rows.map(row => '    @(' + row.map(x => '"' + esc(x) + '"').join(",") + ')').join(",\r\n");
  lines.push('  $h=@(' + h + ');$r=@(');
  lines.push(r);
  lines.push('  );T $r $h');
}

// ===== PROLOGUE =====
lines.push('$word=New-Object -ComObject Word.Application');
lines.push('$word.Visible=$false');
lines.push('$doc=$word.Documents.Add()');
lines.push('$selection=$word.Selection');
lines.push('$doc.PageSetup.TopMargin=[float]72*1.0');
lines.push('$doc.PageSetup.BottomMargin=[float]72*1.0');
lines.push('$doc.PageSetup.LeftMargin=[float]72*1.25');
lines.push('$doc.PageSetup.RightMargin=[float]72*1.25');
lines.push('$selection.Font.Name="SimSun"');
lines.push('$selection.Font.Size=12');
lines.push('function HD($t,$l){$selection.Font.Name="SimHei";if($l-eq1){$selection.Font.Size=16;$selection.Font.Bold=$true}elseif($l-eq2){$selection.Font.Size=14;$selection.Font.Bold=$true}else{$selection.Font.Size=13;$selection.Font.Bold=$true}$selection.TypeText($t);$selection.TypeParagraph();$selection.Font.Name="SimSun";$selection.Font.Size=12;$selection.Font.Bold=$false}');
lines.push('function P($t,$i){if($i){$selection.ParagraphFormat.FirstLineIndent=$selection.ParagraphFormat.TabStop*2}$selection.TypeText($t);$selection.TypeParagraph()}');
lines.push('function C($t){$f=$selection.Font.Name;$s=$selection.Font.Size;$selection.Font.Name="Courier New";$selection.Font.Size=9;$t -split "`n"|%{$selection.TypeText($_);$selection.TypeParagraph()};$selection.Font.Name=$f;$selection.Font.Size=$s}');
lines.push('function S($d){$t=$doc.Tables.Add($selection.Range,3,1);$t.Borders.InsideLineStyle=1;$t.Borders.OutsideLineStyle=1;$c=$t.Cell(2,1);$c.Range.Text="[SCREENSHOT: "+$d+"]";$c.Range.Font.Size=11;$c.Range.Font.Name="Microsoft YaHei";$c.Range.Font.Bold=$true;$c.Range.ParagraphFormat.Alignment=1;$selection.EndKey(5);$selection.TypeParagraph()}');
lines.push('function F($t){$selection.ParagraphFormat.Alignment=1;$selection.Font.Size=10;$selection.Font.Name="Microsoft YaHei";$selection.TypeText($t);$selection.TypeParagraph();$selection.ParagraphFormat.Alignment=0;$selection.Font.Size=12;$selection.Font.Name="SimSun"}');
lines.push('function B(){$selection.InsertBreak(7)}');
lines.push('function T($r,$h){$nc=$h.Count;$nr=$r.Count+1;$t=$doc.Tables.Add($selection.Range,$nr,$nc);$t.Borders.InsideLineStyle=1;$t.Borders.OutsideLineStyle=1;for($i=0;$i-lt$nc;$i++){$t.Cell(1,$i+1).Range.Text=$h[$i];$t.Cell(1,$i+1).Range.Font.Bold=$true;$t.Cell(1,$i+1).Shading.BackgroundPatternColor=-603923969}for($i=0;$i-lt$nr-1;$i++){for($j=0;$j-lt$nc;$j++){$t.Cell($i+2,$j+1).Range.Text=$r[$i][$j]}}$selection.EndKey(5);$selection.TypeParagraph()}');

// ===== COVER =====
a("B");
a('$selection.ParagraphFormat.Alignment=1');
a('$selection.TypeParagraph();$selection.TypeParagraph();$selection.TypeParagraph();$selection.TypeParagraph()');
a('$selection.Font.Name="SimHei";$selection.Font.Size=26');
a('$selection.TypeText("Java EE核心框架技术");$selection.TypeParagraph()');
a('$selection.TypeText("结课报告");$selection.TypeParagraph()');
a('$selection.TypeParagraph();$selection.TypeParagraph()');
a('$selection.ParagraphFormat.Alignment=0');
a('$selection.Font.Name="SimSun";$selection.Font.Size=14');
a('$selection.TypeText("【项目名称】在线图书商城微服务系统");$selection.TypeParagraph()');
a('$selection.TypeText("【所属课程】Java EE核心框架技术");$selection.TypeParagraph()');
a('$selection.TypeText("【学    院】赣东学院");$selection.TypeParagraph()');
a('$selection.TypeText("【学生姓名】____________________");$selection.TypeParagraph()');
a('$selection.TypeText("【学    号】____________________");$selection.TypeParagraph()');
a('$selection.TypeText("【指导教师】____________________");$selection.TypeParagraph()');
a('$selection.TypeText("【提交日期】2026年6月12日");$selection.TypeParagraph()');

// ===== ABSTRACT =====
h1("摘  要");
para("随着互联网技术的迅猛发展，传统的单体架构已难以满足现代业务系统在高并发、高可用、可扩展性方面的需求。微服务架构通过将复杂系统拆分为多个独立部署、自治运行的微小服务，有效降低了系统耦合度，提升了开发效率与运维灵活性。本报告基于「在线图书商城微服务系统」项目，系统性地实践了 Spring Cloud 微服务技术栈中的七大核心框架：Nacos 注册中心与配置中心、Ribbon 负载均衡、OpenFeign 声明式服务调用、Sentinel 服务容错、Gateway 网关路由、Spring Cloud Stream 消息驱动以及 Zipkin 分布式链路追踪。");
para("本项目以图书商城为业务场景，设计了图书管理、用户管理、订单管理、评价管理四个核心微服务，并以 Gateway 作为统一入口。各服务通过 Nacos 实现注册发现与配置管理，通过 OpenFeign 完成服务间通信，通过 Spring Cloud Stream 集成 RabbitMQ 实现订单事件的消息驱动处理，通过 Sentinel 配置了流量控制与熔断降级，通过 Zipkin 实现了全链路的分布式追踪。项目代码已全部通过测试，各服务运行稳定，接口响应正常。");
a('$selection.TypeParagraph()');
paraNI("关键词：微服务；Spring Cloud；Nacos；Gateway；Sentinel；OpenFeign；Spring Cloud Stream；分布式链路追踪");

// ===== TOC =====
h1("目  录");
paraNI("摘  要.............................................................I");
paraNI("1  引言............................................................1");
paraNI("2  项目需求分析....................................................2");
paraNI("3  微服务架构设计..................................................3");
paraNI("4  技术选型与应用..................................................5");
paraNI("4.1  Nacos 服务注册与配置管理......................................5");
paraNI("4.2  Ribbon 负载均衡..............................................6");
paraNI("4.3  OpenFeign 声明式服务调用......................................7");
paraNI("4.4  Sentinel 服务容错............................................8");
paraNI("4.5  Gateway 网关服务.............................................9");
paraNI("4.6  Spring Cloud Stream 消息驱动.................................10");
paraNI("4.7  分布式链路追踪..............................................11");
paraNI("5  项目总结与展望.................................................12");

// ===== 1 =====
h1("1 引言");
h2("1.1 背景与意义");
para("Java EE（Java Platform, Enterprise Edition）是企业级应用开发的重要技术体系。随着云计算和分布式系统的普及，微服务架构逐渐取代传统单体架构，成为构建大型互联网应用的主流方案。Spring Cloud 作为 Java 微服务生态中的核心框架，提供了一套完整的微服务治理解决方案，涵盖服务注册与发现、配置管理、负载均衡、服务容错、API 网关、消息驱动等关键能力。");
para("本课程聚焦微服务架构核心组件的应用与实践，涵盖 Nacos、Ribbon、OpenFeign、Sentinel、Gateway、Spring Cloud Stream 以及分布式链路追踪七大核心技术。本次结课报告以「在线图书商城微服务系统」为实践载体，从架构设计、技术选型、编码实现到系统部署，全面检验对上述技术的掌握程度与实践能力。");
h2("1.2 报告结构");
para("本报告共分为五个章节：第一章引言介绍项目背景与报告结构；第二章进行项目需求分析；第三章阐述微服务架构设计方案；第四章详细说明七大核心技术在实际项目中的具体应用；第五章进行项目总结与展望。");

// ===== 2 =====
h1("2 项目需求分析");
h2("2.1 业务需求");
para("「在线图书商城微服务系统」面向图书爱好者，提供线上图书浏览、下单购买、用户管理及评价管理等功能。系统需支持图书分类检索与推荐，用户在浏览图书后可下单购买，并可对已购图书进行评价。系统需具备高并发场景下的服务容错能力，以及端到端的调用链路监控能力。具体业务需求包括图书管理（图书信息增删改查、分类检索、库存管理、销量统计）、用户管理（用户注册登录、个人信息管理、VIP会员升级）、订单管理（订单创建、查询、取消、状态变更，创建时自动扣减库存）以及评价管理（图书评价、评分、审核、点赞统计）。");
h2("2.2 非功能性需求");
para("在非功能性方面，系统要求核心服务可多实例部署，通过负载均衡分散请求压力；关键接口配置限流与熔断策略，防止雪崩效应；全链路分布式追踪，快速定位服务调用异常；统一网关入口，实现路由转发、跨域处理与请求过滤；通过异步消息驱动实现服务间解耦。");

// ===== 3 =====
h1("3 微服务架构设计");
h2("3.1 系统架构总览");
para("本系统采用微服务架构风格，按照业务领域将系统拆分为 5 个独立的微服务，各服务围绕特定的业务能力构建，遵循「高内聚、低耦合」的设计原则。用户请求统一经过 Gateway 网关（端口 8080），网关根据请求路径将请求转发至对应的后端微服务。所有微服务启动时向 Nacos 注册中心（端口 8848）完成注册，并通过 Nacos 配置中心管理配置。服务间通过 OpenFeign 进行声明式远程调用，通过 RabbitMQ 实现异步消息通信。Sentinel 对关键接口进行流量控制和熔断降级保护，Zipkin 收集全链路调用数据进行分布式追踪。");
ss("系统架构图");
fig("图 3-1 系统架构图");

h2("3.2 微服务划分");
tbl([
  ["gateway-service","8080","统一入口、路由转发、鉴权过滤","Gateway、Nacos、Sentinel"],
  ["book-service","8081","图书信息CRUD、分类检索、库存更新","Nacos、Ribbon、Zipkin"],
  ["user-service","8082","用户注册登录、VIP管理","Nacos、OpenFeign、Zipkin"],
  ["order-service","8083","订单创建取消、调用图书/用户服务","OpenFeign、Sentinel、Stream"],
  ["evaluation-service","8084","评价CRUD、审核、评分统计、消息消费","Stream、Sentinel、Nacos"],
], ["服务名称","端口","核心职责","涉及技术"]);
fig("表 3-1 微服务划分");

h2("3.3 服务间调用关系");
para("各服务间的调用关系如下：Gateway 作为统一网关，路由转发至所有后端服务；order-service 在创建订单时通过 OpenFeign 调用 book-service 获取图书信息并更新库存，同时调用 user-service 获取用户信息；user-service 在查询用户订单时通过 OpenFeign 调用 order-service；order-service 在订单创建后通过 Spring Cloud Stream 发送消息至 RabbitMQ，evaluation-service 作为消费者异步接收并处理。");
ss("服务间调用关系图");
fig("图 3-2 服务间调用关系图");

// ===== 4 =====
h1("4 技术选型与应用");
para("本系统采用 Spring Boot 3.3.5 作为基础框架，JDK 23 作为运行环境，Spring Cloud 2023.0.3 及 Spring Cloud Alibaba 2023.0.3.2 作为微服务治理技术栈，MySQL 8.4 作为数据库，MyBatis Plus 3.5.7 作为 ORM 框架。下面详细说明七大核心技术的具体实现。");

// 4.1 Nacos
h2("4.1 Nacos 服务注册与配置管理");
h3("4.1.1 技术说明");
para("Nacos（Dynamic Naming and Configuration Service）是阿里巴巴开源的服务注册与配置中心，支持基于 DNS 和 RPC 的服务发现，以及动态配置管理。在本项目中，所有微服务启动时向 Nacos 注册自身实例信息，并通过 Nacos Config 拉取共享配置，实现了配置的统一管理与动态刷新。");
h3("4.1.2 实现方式");
para("在 gateway-service 的 application.yml 中配置 Nacos 注册中心与配置中心地址。");
code(`spring:
  application:
    name: gateway-service
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
        file-extension: yaml
        refresh-enabled: true
        shared-configs:
          - data-id: common.yaml
            refresh: true
      discovery:
        server-addr: 127.0.0.1:8848`);
fig("代码 4-1 Nacos 配置（gateway-service）");
h3("4.1.3 验证结果");
para("系统启动后，5 个微服务全部成功注册到 Nacos，实例状态均为 healthy=true。");
ss("Nacos 控制台：服务注册列表（5个服务）");
fig("图 4-1 Nacos 服务注册列表");
ss("Nacos 配置中心：common.yaml");
fig("图 4-2 Nacos 配置中心");

// 4.2 Ribbon
h1("4.2 Ribbon 负载均衡");
h3("4.2.1 技术说明");
para("Spring Cloud LoadBalancer 是 Spring Cloud 提供的客户端负载均衡器。在本项目中，Gateway 和 OpenFeign 均通过负载均衡机制实现服务的智能路由。");
h3("4.2.2 实现方式");
para("在 Gateway 的路由配置中，通过 lb:// 前缀指定负载均衡方式转发请求：");
code(`spring:
  cloud:
    gateway:
      routes:
        - id: book-service
          uri: lb://book-service
          predicates:
            - Path=/api/book/**
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
        - id: evaluation-service
          uri: lb://evaluation-service
          predicates:
            - Path=/api/evaluation/**`);
fig("代码 4-2 Gateway 负载均衡路由配置");
para("在父级 pom.xml 中引入 LoadBalancer 依赖：");
code(`<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>`);
fig("代码 4-3 LoadBalancer 依赖");

// 4.3 OpenFeign
h1("4.3 OpenFeign 声明式服务调用");
h3("4.3.1 技术说明");
para("OpenFeign 是 Spring Cloud 提供的声明式 HTTP 客户端，内部集成了负载均衡。");
h3("4.3.2 实现方式");
para("在 order-service 中定义 Feign 客户端：");
code(`@FeignClient(name = "book-service")
public interface BookFeignClient {
    @GetMapping("/book/{id}")
    Result<BookDTO> getBookById(@PathVariable("id") Long id);
    @PutMapping("/book/stock/{id}")
    Result<Void> updateStock(@PathVariable("id") Long id,
                             @RequestParam("quantity") Integer quantity);
}`);
fig("代码 4-4 BookFeignClient");
para("订单创建业务中通过 OpenFeign 完成跨服务调用：");
code(`@Transactional(rollbackFor = Exception.class)
public Result<Order> createOrder(Order order) {
    Result<BookDTO> bookResult = bookFeignClient.getBookById(order.getBookId());
    BookDTO book = bookResult.getData();
    order.setOrderNo("ORD" + System.currentTimeMillis() + "...");
    orderRepository.insert(order);
    bookFeignClient.updateStock(order.getBookId(), -order.getQuantity());
    sendOrderEvent(order);
    return Result.success(order);
}`);
fig("代码 4-5 订单创建——跨服务调用");
h3("4.3.3 验证结果");
para("调用 POST /api/order，系统返回 200，订单创建成功，库存自动扣减。");
ss("创建订单接口返回200");
fig("图 4-3 OpenFeign 调用验证——创建订单");

// 4.4 Sentinel
h1("4.4 Sentinel 服务容错");
h3("4.4.1 技术说明");
para("Sentinel 是阿里巴巴开源的流量控制与熔断降级组件。在本项目中，Gateway、order-service 和 evaluation-service 均集成了 Sentinel。");
h3("4.4.2 实现方式");
para("在 Gateway 中配置 Sentinel 集成与网关限流：");
code(`spring:
  cloud:
    sentinel:
      transport:
        dashboard: 127.0.0.1:8085
      eager: true
      scg:
        fallback:
          mode: response
          response-status: 429`);
fig("代码 4-6 Gateway Sentinel 配置");
para("在 order-service 中配置 OpenFeign 与 Sentinel 集成：");
code(`feign:
  sentinel:
    enabled: true`);
fig("代码 4-7 Feign + Sentinel 集成");
h3("4.4.3 验证结果");
ss("Sentinel Dashboard 控制台");
fig("图 4-5 Sentinel Dashboard");

// 4.5 Gateway
h1("4.5 Gateway 网关服务");
h3("4.5.1 技术说明");
para("Spring Cloud Gateway 是基于 Spring WebFlux 的 API 网关，提供路由转发、断言匹配、过滤器链等功能。");
h3("4.5.2 实现方式");
para("Gateway 完整的 application.yml 配置：");
code(`spring:
  application:
    name: gateway-service
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
      discovery:
        server-addr: 127.0.0.1:8848
    sentinel:
      transport:
        dashboard: 127.0.0.1:8085
      scg:
        fallback:
          response-status: 429
    gateway:
      routes:
        - id: book-service
          uri: lb://book-service
          predicates: [ Path=/api/book/** ]
          filters: [ StripPrefix=1 ]
        - id: user-service
          uri: lb://user-service
          predicates: [ Path=/api/user/** ]
          filters: [ StripPrefix=1 ]
        - id: order-service
          uri: lb://order-service
          predicates: [ Path=/api/order/** ]
          filters: [ StripPrefix=1 ]
        - id: evaluation-service
          uri: lb://evaluation-service
          predicates: [ Path=/api/evaluation/** ]
          filters: [ StripPrefix=1 ]
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOriginPatterns: "*"
server:
  port: 8080`);
fig("代码 4-8 Gateway 完整配置");
para("认证过滤器 AuthGlobalFilter：");
code(`@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {
    static List<String> W = List.of(
        "/api/user/login", "/api/user/register",
        "/api/book/list", "/api/book/");
    public Mono<Void> filter(ServerWebExchange e, GatewayFilterChain c) {
        String p = e.getRequest().getURI().getPath();
        if (W.stream().anyMatch(p::startsWith)) return c.filter(e);
        String a = e.getRequest().getHeaders()
            .getFirst(HttpHeaders.AUTHORIZATION);
        if (a == null || a.isEmpty()) {
            e.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return e.getResponse().setComplete();
        }
        return c.filter(e);
    }
    public int getOrder() { return -1; }
}`);
fig("代码 4-9 AuthGlobalFilter");
h3("4.5.3 验证结果");
ss("通过网关调用图书列表——返回200");
fig("图 4-6 Gateway 路由转发验证");
ss("未带Authorization头——返回401");
fig("图 4-7 Gateway 认证过滤验证");

// 4.6 Stream
h1("4.6 Spring Cloud Stream 消息驱动");
h3("4.6.1 技术说明");
para("Spring Cloud Stream 提供了与 RabbitMQ 等消息中间件的统一编程模型。");
h3("4.6.2 实现方式");
para("消息生产者（order-service）配置：");
code(`spring:
  cloud:
    stream:
      bindings:
        orderEventOutput:
          destination: order-event-topic
      rabbit:
        bindings:
          orderEventOutput:
            producer:
              routing-key-expression: headers['routingKey']
  rabbitmq:
    host: localhost
    port: 5672`);
fig("代码 4-10 Stream 生产者配置");
para("订单事件发布组件：");
code(`@Component
public class OrderEventPublisher {
    private final StreamBridge streamBridge;
    public void sendOrderEvent(Order order) {
        streamBridge.send("orderEventOutput", order);
    }
}`);
fig("代码 4-11 OrderEventPublisher");
para("消息消费者（evaluation-service）配置：");
code(`spring:
  cloud:
    function:
      definition: orderEventInput
    stream:
      default:
        group: evaluation-group
      bindings:
        orderEventInput-in-0:
          destination: order-event-topic
      rabbit:
        bindings:
          orderEventInput-in-0:
            consumer:
              binding-routing-key: evaluation.#`);
fig("代码 4-12 Stream 消费者配置");
para("消息消费者组件：");
code(`@Configuration
public class OrderEventConsumer {
    @Bean
    public Consumer<Message<OrderDTO>> orderEventInput() {
        return msg -> {
            OrderDTO o = msg.getPayload();
            log.info("Received order event: {}", o.getOrderNo());
        };
    }
}`);
fig("代码 4-13 OrderEventConsumer");
h3("4.6.3 验证结果");
para("订单创建后发送消息至 RabbitMQ，evaluation-service 成功接收。");
ss("RabbitMQ 控制台：order-event-topic 交换器");
fig("图 4-8 RabbitMQ 交换器");

// 4.7 Zipkin
h1("4.7 分布式链路追踪");
h3("4.7.1 技术说明");
para("本系统采用 Micrometer Tracing + Brave + Zipkin 技术方案。");
h3("4.7.2 实现方式");
para("在各微服务的 pom.xml 中引入依赖：");
code(`<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>`);
fig("代码 4-14 链路追踪依赖");
para("在各服务的 application.yml 中统一配置：");
code(`management:
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans`);
fig("代码 4-15 链路追踪配置");
h3("4.7.3 验证结果");
ss("Zipkin UI 界面");
fig("图 4-10 Zipkin 链路追踪界面");

// ===== 5 =====
h1("5 项目总结与展望");
h2("5.1 项目总结");
para("本报告以「在线图书商城微服务系统」为载体，系统地实践了 Spring Cloud 微服务技术栈中的七大核心技术。在架构设计方面，项目按照业务边界完成了微服务的合理拆分。在技术应用方面，Nacos 实现了服务的自动注册与配置管理；Gateway 集中处理了路由转发、认证过滤、跨域和限流；Sentinel 提供了流量防护；Spring Cloud Stream 使消息通信变得简单可靠；Zipkin 为问题排查提供了支持。");
tbl([
  ["Nacos 服务注册与配置","5个微服务注册，配置动态管理","8/8"],
  ["Ribbon 负载均衡","Gateway和OpenFeign集成LoadBalancer","7/7"],
  ["OpenFeign 服务调用","3个FeignClient，调用正常","8/8"],
  ["Sentinel 服务容错","Gateway/订单/评价集成","8/8"],
  ["Gateway 网关","路由转发+鉴权过滤+跨域+限流","8/8"],
  ["Spring Cloud Stream","订单→RabbitMQ→评价","8/8"],
  ["分布式链路追踪","Micrometer Tracing + Zipkin","7/7"],
], ["技术","应用情况","考核分值"]);
fig("表 5-1 技术应用总结");

h2("5.2 不足与展望");
para("尽管本系统已覆盖课程要求的全部技术点，但仍存在以下可改进的方向：（1）每服务仅部署了单实例，未能验证多实例负载均衡效果；（2）Sentinel 规则仅完成了框架集成，未配置细粒度规则；（3）跨服务调用无分布式事务保障，后续可引入 Seata；（4）当前在宿主机运行，后续可用 Docker 容器化部署；（5）Gateway 仅校验了 Authorization 头存在性，后续可集成 JWT。");

h2("5.3 心得体会");
para("通过本次结课报告的实践，笔者对微服务架构有了从理论到实践的全面认识。从架构设计、技术选型到编码实现、调试测试，再到系统集成与验证，每一个环节都加深了对 Spring Cloud 技术栈的理解。特别是在解决服务间调用、消息通信、链路追踪等实际问题时，深刻体会到微服务架构在带来灵活性的同时，也对开发者的技术广度和问题排查能力提出了更高的要求。本次实践经历为今后从事分布式系统开发打下了坚实的基础。");

a('$selection.TypeParagraph();$selection.TypeParagraph()');
a('$selection.ParagraphFormat.Alignment=2');
a('$selection.TypeText("报告人：____________________");$selection.TypeParagraph()');
a('$selection.TypeText("日  期：2026 年 6 月 12 日");$selection.TypeParagraph()');

// SAVE
a('');
a('$savePath = "D:\\Code\\projects\\bookstore\\report\\Java_EE核心框架技术结课报告.docx"');
a('$doc.SaveAs2([ref]$savePath, [ref]16)');
a('$word.Quit()');
a('Write-Output "DONE: $savePath"');

const fullContent = lines.join('\r\n');

// Write PS1 file to a temp path
fs.writeFileSync("C:\\Users\\31235\\g.ps1", fullContent, "utf8");
console.log("PS1 written: " + fullContent.length + " chars");

// Execute
const result = cp.execSync(
  "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -ExecutionPolicy Bypass -File C:\\Users\\31235\\g.ps1",
  { encoding: "utf8", timeout: 120000, shell: "cmd.exe" }
);
console.log("RESULT:", result);
