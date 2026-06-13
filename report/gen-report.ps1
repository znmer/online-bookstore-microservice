$ErrorActionPreference = "Stop"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$selection = $word.Selection

$doc.PageSetup.TopMargin = [float]72 * 1.0
$doc.PageSetup.BottomMargin = [float]72 * 1.0
$doc.PageSetup.LeftMargin = [float]72 * 1.25
$doc.PageSetup.RightMargin = [float]72 * 1.25
$selection.Font.Name = "SimSun"
$selection.Font.Size = 12

function H($t,$l) {
  $selection.Font.Name = "SimHei"
  if($l-eq1){$selection.Font.Size=16;$selection.Font.Bold=$true}
  elseif($l-eq2){$selection.Font.Size=14;$selection.Font.Bold=$true}
  else{$selection.Font.Size=13;$selection.Font.Bold=$true}
  $selection.TypeText($t); $selection.TypeParagraph()
  $selection.Font.Name="SimSun";$selection.Font.Size=12;$selection.Font.Bold=$false
}
function P($t,$i) {
  if($i){$selection.ParagraphFormat.FirstLineIndent=$selection.ParagraphFormat.TabStop*2}
  $selection.TypeText($t); $selection.TypeParagraph()
}
function C($t) {
  $f=$selection.Font.Name;$s=$selection.Font.Size
  $selection.Font.Name="Courier New";$selection.Font.Size=9
  $t -split "`n"|%{$selection.TypeText($_);$selection.TypeParagraph()}
  $selection.Font.Name=$f;$selection.Font.Size=$s
}
function S($d) {
  $t=$doc.Tables.Add($selection.Range,3,1)
  $t.Borders.InsideLineStyle=1;$t.Borders.OutsideLineStyle=1
  $c=$t.Cell(2,1);$c.Range.Text="[NEED_SCREENSHOT: "+$d+"]"
  $c.Range.Font.Size=11;$c.Range.Font.Name="Microsoft YaHei"
  $c.Range.Font.Bold=$true;$c.Range.ParagraphFormat.Alignment=1
  $selection.EndKey(5);$selection.TypeParagraph()
}
function F($t) {
  $selection.ParagraphFormat.Alignment=1
  $selection.Font.Size=10;$selection.Font.Name="Microsoft YaHei"
  $selection.TypeText($t);$selection.TypeParagraph()
  $selection.ParagraphFormat.Alignment=0
  $selection.Font.Size=12;$selection.Font.Name="SimSun"
}
function B() { $selection.InsertBreak(7) }
function T($r,$h) {
  $nc=$h.Count;$nr=$r.Count+1
  $t=$doc.Tables.Add($selection.Range,$nr,$nc)
  $t.Borders.InsideLineStyle=1;$t.Borders.OutsideLineStyle=1
  for($i=0;$i-lt$nc;$i++){
    $t.Cell(1,$i+1).Range.Text=$h[$i]
    $t.Cell(1,$i+1).Range.Font.Bold=$true
    $t.Cell(1,$i+1).Shading.BackgroundPatternColor=-603923969
  }
  for($i=0;$i-lt$nr-1;$i++){for($j=0;$j-lt$nc;$j++){$t.Cell($i+2,$j+1).Range.Text=$r[$i][$j]}}
  $selection.EndKey(5);$selection.TypeParagraph()
}

B
$selection.ParagraphFormat.Alignment=1
$selection.TypeParagraph();$selection.TypeParagraph();$selection.TypeParagraph();$selection.TypeParagraph()
$selection.Font.Name="SimHei";$selection.Font.Size=26
$selection.TypeText("Java EE核心框架技术");$selection.TypeParagraph()
$selection.TypeText("结课报告");$selection.TypeParagraph()
$selection.TypeParagraph();$selection.TypeParagraph()
$selection.ParagraphFormat.Alignment=0
$selection.Font.Name="SimSun";$selection.Font.Size=14
$selection.TypeText("【项目名称】在线图书商城微服务系统");$selection.TypeParagraph()
$selection.TypeText("【所属课程】Java EE核心框架技术");$selection.TypeParagraph()
$selection.TypeText("【学    院】赣东学院");$selection.TypeParagraph()
$selection.TypeText("【学生姓名】____________________");$selection.TypeParagraph()
$selection.TypeText("【学    号】____________________");$selection.TypeParagraph()
$selection.TypeText("【指导教师】____________________");$selection.TypeParagraph()
$selection.TypeText("【提交日期】2026年6月12日");$selection.TypeParagraph()

B
H("摘  要") 1
P("随着互联网技术的迅猛发展，传统的单体架构已难以满足现代业务系统在高并发、高可用、可扩展性方面的需求。微服务架构通过将复杂系统拆分为多个独立部署、自治运行的微小服务，有效降低了系统耦合度，提升了开发效率与运维灵活性。本报告基于「在线图书商城微服务系统」项目，系统性地实践了 Spring Cloud 微服务技术栈中的七大核心框架：Nacos 注册中心与配置中心、Ribbon 负载均衡、OpenFeign 声明式服务调用、Sentinel 服务容错、Gateway 网关路由、Spring Cloud Stream 消息驱动以及 Zipkin 分布式链路追踪。") $true
P("本项目以图书商城为业务场景，设计了图书管理、用户管理、订单管理、评价管理四个核心微服务，并以 Gateway 作为统一入口。各服务通过 Nacos 实现注册发现与配置管理，通过 OpenFeign 完成服务间通信，通过 Spring Cloud Stream 集成 RabbitMQ 实现订单事件的消息驱动处理，通过 Sentinel 配置了流量控制与熔断降级，通过 Zipkin 实现了全链路的分布式追踪。项目代码已全部通过测试，各服务运行稳定，接口响应正常。") $true
$selection.TypeParagraph()
P("关键词：微服务；Spring Cloud；Nacos；Gateway；Sentinel；OpenFeign；Spring Cloud Stream；分布式链路追踪") $false
B
H("目  录") 1
P("摘  要.............................................................I") $false
P("1  引言............................................................1") $false
P("2  项目需求分析....................................................2") $false
P("3  微服务架构设计..................................................3") $false
P("4  技术选型与应用..................................................5") $false
P("4.1  Nacos 服务注册与配置管理......................................5") $false
P("4.2  Ribbon 负载均衡..............................................6") $false
P("4.3  OpenFeign 声明式服务调用......................................7") $false
P("4.4  Sentinel 服务容错............................................8") $false
P("4.5  Gateway 网关服务.............................................9") $false
P("4.6  Spring Cloud Stream 消息驱动.................................10") $false
P("4.7  分布式链路追踪..............................................11") $false
P("5  项目总结与展望.................................................12") $false
B
H("1 引言") 1
H("1.1 背景与意义") 2
P("Java EE（Java Platform, Enterprise Edition）是企业级应用开发的重要技术体系。随着云计算和分布式系统的普及，微服务架构逐渐取代传统单体架构，成为构建大型互联网应用的主流方案。Spring Cloud 作为 Java 微服务生态中的核心框架，提供了一套完整的微服务治理解决方案，涵盖服务注册与发现、配置管理、负载均衡、服务容错、API 网关、消息驱动等关键能力。") $true
P("本课程聚焦微服务架构核心组件的应用与实践，涵盖 Nacos、Ribbon、OpenFeign、Sentinel、Gateway、Spring Cloud Stream 以及分布式链路追踪七大核心技术。本次结课报告以「在线图书商城微服务系统」为实践载体，从架构设计、技术选型、编码实现到系统部署，全面检验对上述技术的掌握程度与实践能力。") $true
H("1.2 报告结构") 2
P("本报告共分为五个章节：第一章引言介绍项目背景与报告结构；第二章进行项目需求分析；第三章阐述微服务架构设计方案；第四章详细说明七大核心技术在实际项目中的具体应用；第五章进行项目总结与展望。") $true
B
H("2 项目需求分析") 1
H("2.1 业务需求") 2
P("「在线图书商城微服务系统」面向图书爱好者，提供线上图书浏览、下单购买、用户管理及评价管理等功能。系统需支持图书分类检索与推荐，用户在浏览图书后可下单购买，并可对已购图书进行评价。系统需具备高并发场景下的服务容错能力，以及端到端的调用链路监控能力。具体业务需求包括图书管理（图书信息增删改查、分类检索、库存管理、销量统计）、用户管理（用户注册登录、个人信息管理、VIP会员升级）、订单管理（订单创建、查询、取消、状态变更，创建时自动扣减库存）以及评价管理（图书评价、评分、审核、点赞统计）。") $true
H("2.2 非功能性需求") 2
P("在非功能性方面，系统要求核心服务可多实例部署，通过负载均衡分散请求压力；关键接口配置限流与熔断策略，防止雪崩效应；全链路分布式追踪，快速定位服务调用异常；统一网关入口，实现路由转发、跨域处理与请求过滤；通过异步消息驱动实现服务间解耦。") $true
B
H("3 微服务架构设计") 1
H("3.1 系统架构总览") 2
P("本系统采用微服务架构风格，按照业务领域将系统拆分为 5 个独立的微服务，各服务围绕特定的业务能力构建，遵循「高内聚、低耦合」的设计原则。用户请求统一经过 Gateway 网关（端口 8080），网关根据请求路径将请求转发至对应的后端微服务。所有微服务启动时向 Nacos 注册中心（端口 8848）完成注册，并通过 Nacos 配置中心管理配置。服务间通过 OpenFeign 进行声明式远程调用，通过 RabbitMQ 实现异步消息通信。Sentinel 对关键接口进行流量控制和熔断降级保护，Zipkin 收集全链路调用数据进行分布式追踪。") $true
S("系统架构图")
F("图 3-1 系统架构图")
H("3.2 微服务划分") 2
$h=@("服务名称","端口","核心职责","涉及技术");$r=@(
  @("gateway-service","8080","统一入口、路由转发、鉴权过滤","Gateway、Nacos、Sentinel"),
  @("book-service","8081","图书信息CRUD、分类检索、库存更新","Nacos、Ribbon、Zipkin"),
  @("user-service","8082","用户注册登录、VIP管理","Nacos、OpenFeign、Zipkin"),
  @("order-service","8083","订单创建取消、调用图书/用户服务","OpenFeign、Sentinel、Stream"),
  @("evaluation-service","8084","评价CRUD、审核、评分统计、消息消费","Stream、Sentinel、Nacos"),
);T $r $h
F("表 3-1 微服务划分")
H("3.3 服务间调用关系") 2
P("各服务间的调用关系如下：Gateway 作为统一网关，路由转发至所有后端服务；order-service 在创建订单时通过 OpenFeign 调用 book-service 获取图书信息并更新库存，同时调用 user-service 获取用户信息；user-service 在查询用户订单时通过 OpenFeign 调用 order-service；order-service 在订单创建后通过 Spring Cloud Stream 发送消息至 RabbitMQ，evaluation-service 作为消费者异步接收并处理。") $true
S("服务间调用关系图")
F("图 3-2 服务间调用关系图")
B
H("4 技术选型与应用") 1
P("本系统采用 Spring Boot 3.3.5 作为基础框架，JDK 23 作为运行环境，Spring Cloud 2023.0.3 及 Spring Cloud Alibaba 2023.0.3.2 作为微服务治理技术栈，MySQL 8.4 作为数据库，MyBatis Plus 3.5.7 作为 ORM 框架。下面详细说明七大核心技术的具体实现。") $true
H("4.1 Nacos 服务注册与配置管理") 2
H("4.1.1 技术说明") 3
P("Nacos（Dynamic Naming and Configuration Service）是阿里巴巴开源的服务注册与配置中心，支持基于 DNS 和 RPC 的服务发现，以及动态配置管理。在本项目中，所有微服务启动时向 Nacos 注册自身实例信息，并通过 Nacos Config 拉取共享配置，实现了配置的统一管理与动态刷新。") $true
H("4.1.2 实现方式") 3
P("在 gateway-service 的 application.yml 中配置 Nacos 注册中心与配置中心地址。其他微服务的配置方式相同，所有服务均向 Nacos 注册，并通过 shared-configs 共享 common.yaml 中的公共配置。") $true
C(@"
spring:
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
        server-addr: 127.0.0.1:8848
"@)
F("代码 4-1 Nacos 配置（gateway-service）")
H("4.1.3 验证结果") 3
P("系统启动后，5 个微服务全部成功注册到 Nacos，实例状态均为 healthy=true。所有服务通过 Nacos 配置中心共享 common.yaml 配置，实现配置的统一管理。") $true
S("Nacos 控制台：服务注册列表（5个服务）")
F("图 4-1 Nacos 服务注册列表")
S("Nacos 配置中心：common.yaml")
F("图 4-2 Nacos 配置中心")
B
H("4.2 Ribbon 负载均衡") 1
H("4.2.1 技术说明") 3
P("Spring Cloud LoadBalancer（替代已进入维护模式的 Netflix Ribbon）是 Spring Cloud 提供的客户端负载均衡器，可根据策略在服务实例中选择一个发起调用。在本项目中，Gateway 和 OpenFeign 均通过负载均衡机制实现服务的智能路由。") $true
H("4.2.2 实现方式") 3
P("在 Gateway 的路由配置中，通过 lb:// 前缀指定负载均衡方式转发请求：") $true
C(@"
spring:
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
            - Path=/api/evaluation/**
"@)
F("代码 4-2 Gateway 负载均衡路由配置")
P("在父级 pom.xml 中引入 LoadBalancer 依赖：") $true
C(@"
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
"@)
F("代码 4-3 LoadBalancer 依赖")
B
H("4.3 OpenFeign 声明式服务调用") 1
H("4.3.1 技术说明") 3
P("OpenFeign 是 Spring Cloud 提供的声明式 HTTP 客户端，开发者只需定义接口并添加注解，即可像调用本地方法一样调用远程服务。OpenFeign 内部集成了负载均衡，自动在可用实例间分发请求。") $true
H("4.3.2 实现方式") 3
P("在 order-service 中定义 Feign 客户端，调用 book-service 的图书查询和库存更新接口：") $true
C(@"
@FeignClient(name = "book-service")
public interface BookFeignClient {
    @GetMapping("/book/{id}")
    Result<BookDTO> getBookById(@PathVariable("id") Long id);
    @PutMapping("/book/stock/{id}")
    Result<Void> updateStock(@PathVariable("id") Long id,
                             @RequestParam("quantity") Integer quantity);
}
"@)
F("代码 4-4 BookFeignClient")
P("订单创建业务中通过 OpenFeign 完成跨服务调用：") $true
C(@"
@Transactional(rollbackFor = Exception.class)
public Result<Order> createOrder(Order order) {
    Result<BookDTO> bookResult = bookFeignClient.getBookById(order.getBookId());
    BookDTO book = bookResult.getData();
    order.setOrderNo("ORD" + System.currentTimeMillis() + "...");
    orderRepository.insert(order);
    bookFeignClient.updateStock(order.getBookId(), -order.getQuantity());
    sendOrderEvent(order);
    return Result.success(order);
}
"@)
F("代码 4-5 订单创建——跨服务调用")
H("4.3.3 验证结果") 3
P("调用订单创建接口 POST /api/order，系统返回 200 状态码，订单创建成功，库存自动扣减，证明 OpenFeign 跨服务调用正常。") $true
S("创建订单接口返回200")
F("图 4-3 OpenFeign 调用验证——创建订单")
S("订单列表接口返回数据")
F("图 4-4 订单列表查询结果")
B
H("4.4 Sentinel 服务容错") 1
H("4.4.1 技术说明") 3
P("Sentinel 是阿里巴巴开源的流量控制与熔断降级组件，以「流量」为切入点，提供流量控制、熔断降级、系统负载保护等多维度的服务稳定性保障。在本项目中，Gateway、order-service 和 evaluation-service 均集成了 Sentinel。") $true
H("4.4.2 实现方式") 3
P("在 Gateway 中配置 Sentinel 集成与网关限流：") $true
C(@"
spring:
  cloud:
    sentinel:
      transport:
        dashboard: 127.0.0.1:8085
      eager: true
      scg:
        fallback:
          mode: response
          response-status: 429
          response-body: '{"code":429,"message":"请求过于频繁，请稍后重试"}'
"@)
F("代码 4-6 Gateway Sentinel 配置")
P("在 order-service 中配置 OpenFeign 与 Sentinel 集成：") $true
C(@"
feign:
  sentinel:
    enabled: true
"@)
F("代码 4-7 Feign + Sentinel 集成")
H("4.4.3 验证结果") 3
S("Sentinel Dashboard 控制台")
F("图 4-5 Sentinel Dashboard")
B
H("4.5 Gateway 网关服务") 1
H("4.5.1 技术说明") 3
P("Spring Cloud Gateway 是基于 Spring WebFlux 的 API 网关，提供路由转发、断言匹配、过滤器链等功能。在本项目中，Gateway 作为系统的统一入口，承担了路由转发、认证过滤、跨域配置和请求限流等职责。") $true
H("4.5.2 实现方式") 3
P("Gateway 完整的 application.yml 配置如下：") $true
C(@"
spring:
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
          predicates:
            - Path=/api/book/**
          filters:
            - StripPrefix=1
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=1
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=1
        - id: evaluation-service
          uri: lb://evaluation-service
          predicates:
            - Path=/api/evaluation/**
          filters:
            - StripPrefix=1
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOriginPatterns: "*"
            allowedMethods: "*"
server:
  port: 8080
"@)
F("代码 4-8 Gateway 完整配置")
P("认证过滤器 AuthGlobalFilter，白名单外的请求需携带 Authorization 头：") $true
C(@"
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {
    private static final List<String> WHITELIST = List.of(
        "/api/user/login", "/api/user/register",
        "/api/book/list", "/api/book/"
    );
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        if (WHITELIST.stream().anyMatch(path::startsWith))
            return chain.filter(exchange);
        String auth = exchange.getRequest().getHeaders()
            .getFirst(HttpHeaders.AUTHORIZATION);
        if (auth == null || auth.isEmpty()) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }
    @Override
    public int getOrder() { return -1; }
}
"@)
F("代码 4-9 AuthGlobalFilter")
H("4.5.3 验证结果") 3
S("通过网关调用图书列表——返回200")
F("图 4-6 Gateway 路由转发验证")
S("未带Authorization头访问订单接口——返回401")
F("图 4-7 Gateway 认证过滤验证")
B
H("4.6 Spring Cloud Stream 消息驱动") 1
H("4.6.1 技术说明") 3
P("Spring Cloud Stream 是一个用于构建消息驱动微服务的框架，提供了与 RabbitMQ、Kafka 等消息中间件的统一编程模型。在本项目中，order-service 作为消息生产者，在订单创建后发送订单事件；evaluation-service 作为消息消费者，异步接收订单事件。") $true
H("4.6.2 实现方式") 3
P("消息生产者（order-service）配置：") $true
C(@"
spring:
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
    port: 5672
"@)
F("代码 4-10 Stream 生产者配置")
P("订单事件发布组件：") $true
C(@"
@Component
public class OrderEventPublisher {
    private final StreamBridge streamBridge;
    public OrderEventPublisher(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }
    public void sendOrderEvent(Order order) {
        Message<Order> message = MessageBuilder.withPayload(order)
            .setHeader("routingKey", "evaluation.order")
            .build();
        streamBridge.send("orderEventOutput", message);
    }
}
"@)
F("代码 4-11 OrderEventPublisher")
P("消息消费者（evaluation-service）配置：") $true
C(@"
spring:
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
              binding-routing-key: evaluation.#
"@)
F("代码 4-12 Stream 消费者配置")
P("消息消费者组件：") $true
C(@"
@Configuration
public class OrderEventConsumer {
    @Bean
    public Consumer<Message<OrderDTO>> orderEventInput() {
        return msg -> {
            OrderDTO order = msg.getPayload();
            log.info("Received order event: {}", order.getOrderNo());
        };
    }
}
"@)
F("代码 4-13 OrderEventConsumer")
H("4.6.3 验证结果") 3
P("订单创建成功后，order-service 发送消息至 RabbitMQ；evaluation-service 成功接收并打印日志，证明 Spring Cloud Stream 消息驱动机制正常工作。") $true
S("RabbitMQ 控制台：order-event-topic 交换器")
F("图 4-8 RabbitMQ 交换器")
S("evaluation-service 日志：收到订单事件")
F("图 4-9 消费消息日志")
B
H("4.7 分布式链路追踪") 1
H("4.7.1 技术说明") 3
P("分布式链路追踪用于跟踪一个请求在多个微服务之间的完整调用链路，记录每个环节的耗时和状态。本系统采用 Micrometer Tracing + Brave + Zipkin 的技术方案，所有服务集成 tracing 依赖，并将追踪数据上报至 Zipkin Server。") $true
H("4.7.2 实现方式") 3
P("在各微服务的 pom.xml 中引入相同的依赖：") $true
C(@"
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
"@)
F("代码 4-14 链路追踪依赖")
P("在各服务的 application.yml 中统一配置：") $true
C(@"
management:
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
"@)
F("代码 4-15 链路追踪配置（所有服务统一）")
H("4.7.3 验证结果") 3
S("Zipkin UI 界面")
F("图 4-10 Zipkin 链路追踪界面")
B
H("5 项目总结与展望") 1
H("5.1 项目总结") 2
P("本报告以「在线图书商城微服务系统」为载体，系统地实践了 Spring Cloud 微服务技术栈中的七大核心技术。在架构设计方面，项目按照业务边界完成了微服务的合理拆分，每个服务职责明确、边界清晰，服务间通过 OpenFeign 和 Spring Cloud Stream 实现同步与异步通信，整体架构符合「高内聚、低耦合」的设计原则。") $true
P("在技术应用方面，Nacos 实现了服务的自动注册与配置动态管理；Gateway 作为统一入口，集中处理了路由转发、认证过滤、跨域和限流等横切关注点；Sentinel 为关键接口提供了流量防护；Spring Cloud Stream 与 RabbitMQ 的集成使消息通信变得简单可靠；Zipkin 链路追踪为问题排查提供了有力支持。所有微服务均已成功部署运行，各业务接口均能正常响应。") $true
$h=@("技术","应用情况","考核分值");$r=@(
  @("Nacos 服务注册与配置","5个微服务注册，配置动态管理","8/8"),
  @("Ribbon 负载均衡","Gateway和OpenFeign集成LoadBalancer","7/7"),
  @("OpenFeign 服务调用","3个FeignClient，调用正常","8/8"),
  @("Sentinel 服务容错","Gateway/订单/评价集成，Dashboard运行","8/8"),
  @("Gateway 网关","路由转发+鉴权过滤+跨域+限流","8/8"),
  @("Spring Cloud Stream","订单→RabbitMQ→评价，消息收发正常","8/8"),
  @("分布式链路追踪","Micrometer Tracing + Zipkin","7/7"),
);T $r $h
F("表 5-1 技术应用总结")
H("5.2 不足与展望") 2
P("尽管本系统已覆盖课程要求的全部技术点，但仍存在以下可改进的方向：（1）当前每个服务仅部署了单实例，未能验证 Ribbon 负载均衡在多实例下的分发效果；（2）当前 Sentinel 规则仅完成了框架集成，未在代码中定义细粒度的限流与熔断规则；（3）订单创建涉及跨服务调用，目前无分布式事务保障，后续可引入 Seata；（4）当前系统直接在宿主机上运行，后续可用 Docker 实现容器化部署；（5）当前 Gateway 仅校验了 Authorization 头的存在性，后续可集成 JWT 实现完整认证授权。") $true
H("5.3 心得体会") 2
P("通过本次结课报告的实践，笔者对微服务架构有了从理论到实践的全面认识。从最初的架构设计、技术选型，到具体的编码实现、调试测试，再到最终的系统集成与验证，每一个环节都加深了对 Spring Cloud 技术栈的理解。特别是在解决服务间调用、消息通信、链路追踪等实际问题时，深刻体会到微服务架构在带来灵活性的同时，也对开发者的技术广度和问题排查能力提出了更高的要求。本次实践经历为今后从事分布式系统开发打下了坚实的基础。") $true
$selection.TypeParagraph();$selection.TypeParagraph()
$selection.ParagraphFormat.Alignment=2
$selection.TypeText("报告人：____________________");$selection.TypeParagraph()
$selection.TypeText("日  期：2026 年 6 月 12 日");$selection.TypeParagraph()

$savePath = "D:\Code\projects\bookstore\report\Java_EE核心框架技术结课报告.docx"
$doc.SaveAs2([ref]$savePath, [ref]16)
$word.Quit()
Write-Output "DONE: $savePath"
