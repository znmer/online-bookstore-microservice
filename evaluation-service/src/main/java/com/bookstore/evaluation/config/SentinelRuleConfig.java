package com.bookstore.evaluation.config;

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
 * Sentinel 规则配置 - evaluation-service
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
        log.info("Sentinel rules initialized for evaluation-service");
    }

    /**
     * 流量控制规则
     */
    private void initFlowRules() {
        List<FlowRule> rules = new ArrayList<>();

        // 1. 创建评价接口限流：QPS 阈值 10
        FlowRule createEvalRule = new FlowRule();
        createEvalRule.setResource("createEvaluation");
        createEvalRule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        createEvalRule.setCount(10);
        createEvalRule.setControlBehavior(RuleConstant.CONTROL_BEHAVIOR_DEFAULT);
        rules.add(createEvalRule);

        // 2. 查询评价列表限流：QPS 阈值 30
        FlowRule listEvalRule = new FlowRule();
        listEvalRule.setResource("listEvaluations");
        listEvalRule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        listEvalRule.setCount(30);
        rules.add(listEvalRule);

        FlowRuleManager.loadRules(rules);
        log.info("Loaded {} flow rules for evaluation-service", rules.size());
    }

    /**
     * 熔断降级规则
     */
    private void initDegradeRules() {
        List<DegradeRule> rules = new ArrayList<>();

        // 创建评价熔断：异常比例 >= 0.3 则熔断，熔断时长 15s
        DegradeRule createEvalDegrade = new DegradeRule();
        createEvalDegrade.setResource("createEvaluation");
        createEvalDegrade.setGrade(RuleConstant.DEGRADE_GRADE_EXCEPTION_RATIO);
        createEvalDegrade.setCount(0.3);
        createEvalDegrade.setTimeWindow(15);
        createEvalDegrade.setMinRequestAmount(5);
        rules.add(createEvalDegrade);

        DegradeRuleManager.loadRules(rules);
        log.info("Loaded {} degrade rules for evaluation-service", rules.size());
    }
}
