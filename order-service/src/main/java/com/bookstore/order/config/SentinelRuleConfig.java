package com.bookstore.order.config;

import com.alibaba.csp.sentinel.annotation.aspectj.SentinelResourceAspect;
import com.alibaba.csp.sentinel.slots.block.RuleConstant;
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeRule;
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeRuleManager;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRule;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRuleManager;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * Sentinel 规则配置 - order-service
 * 定义流量控制规则和熔断降级规则
 */
@Configuration
public class SentinelRuleConfig {

    private static final Logger log = LoggerFactory.getLogger(SentinelRuleConfig.class);

    @Bean
    public SentinelResourceAspect sentinelResourceAspect() {
        return new SentinelResourceAspect();
    }

    @PostConstruct
    public void initRules() {
        initFlowRules();
        initDegradeRules();
        log.info("Sentinel rules initialized for order-service");
    }

    /**
     * 流量控制规则
     */
    private void initFlowRules() {
        List<FlowRule> rules = new ArrayList<>();

        // 1. 创建订单接口限流：QPS 阈值 10
        FlowRule createOrderRule = new FlowRule();
        createOrderRule.setResource("createOrder");
        createOrderRule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        createOrderRule.setCount(10);
        createOrderRule.setStrategy(RuleConstant.STRATEGY_DIRECT);
        createOrderRule.setControlBehavior(RuleConstant.CONTROL_BEHAVIOR_DEFAULT);
        rules.add(createOrderRule);

        // 2. 订单列表查询限流：QPS 阈值 20
        FlowRule listOrdersRule = new FlowRule();
        listOrdersRule.setResource("listOrders");
        listOrdersRule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        listOrdersRule.setCount(20);
        rules.add(listOrdersRule);

        // 3. 取消订单限流：QPS 阈值 5
        FlowRule cancelOrderRule = new FlowRule();
        cancelOrderRule.setResource("cancelOrder");
        cancelOrderRule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        cancelOrderRule.setCount(5);
        rules.add(cancelOrderRule);

        FlowRuleManager.loadRules(rules);
        log.info("Loaded {} flow rules for order-service", rules.size());
    }

    /**
     * 熔断降级规则
     */
    private void initDegradeRules() {
        List<DegradeRule> rules = new ArrayList<>();

        // 创建订单熔断：慢调用比例 >= 0.5 则熔断，熔断时长 10s
        DegradeRule createOrderDegrade = new DegradeRule();
        createOrderDegrade.setResource("createOrder");
        createOrderDegrade.setGrade(RuleConstant.DEGRADE_GRADE_RT);
        createOrderDegrade.setCount(2000); // 最大RT 2000ms
        createOrderDegrade.setTimeWindow(10);
        createOrderDegrade.setMinRequestAmount(5);
        createOrderDegrade.setSlowRatioThreshold(0.5);
        rules.add(createOrderDegrade);

        DegradeRuleManager.loadRules(rules);
        log.info("Loaded {} degrade rules for order-service", rules.size());
    }
}
