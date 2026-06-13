package com.bookstore.evaluation.service.impl;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookstore.common.dto.Result;
import com.bookstore.evaluation.entity.Evaluation;
import com.bookstore.evaluation.repository.EvaluationRepository;
import com.bookstore.evaluation.service.EvaluationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EvaluationServiceImpl implements EvaluationService {

    private static final Logger log = LoggerFactory.getLogger(EvaluationServiceImpl.class);

    private final EvaluationRepository evaluationRepository;

    public EvaluationServiceImpl(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    @Override
    @SentinelResource(
        value = "createEvaluation",
        fallback = "createEvaluationFallback",
        blockHandler = "createEvaluationBlockHandler"
    )
    public Result<Evaluation> createEvaluation(Evaluation evaluation) {
        evaluation.setStatus("PENDING");
        evaluation.setLikeCount(0);
        evaluation.setCreateTime(LocalDateTime.now());
        evaluation.setUpdateTime(LocalDateTime.now());
        evaluationRepository.insert(evaluation);
        log.info("Created evaluation: id={}, userId={}, bookId={}", evaluation.getId(), evaluation.getUserId(), evaluation.getBookId());
        return Result.success(evaluation);
    }

    /**
     * createEvaluation 的 fallback：业务异常时调用
     */
    public Result<Evaluation> createEvaluationFallback(Evaluation evaluation, Throwable t) {
        log.error("Create evaluation fallback: {}", t.getMessage());
        return Result.error("Evaluation service is busy, please try later");
    }

    /**
     * createEvaluation 的 blockHandler：限流熔断时调用
     */
    public Result<Evaluation> createEvaluationBlockHandler(Evaluation evaluation, BlockException e) {
        log.warn("Create evaluation blocked by Sentinel: {}", e.getClass().getSimpleName());
        return Result.error(429, "Too many evaluation requests, please slow down");
    }

    @Override
    @SentinelResource(value = "approveEvaluation", fallback = "approveFallback")
    public Result<Evaluation> approveEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.selectById(id);
        if (evaluation == null) {
            return Result.error("Evaluation not found");
        }
        evaluation.setStatus("APPROVED");
        evaluation.setUpdateTime(LocalDateTime.now());
        evaluationRepository.updateById(evaluation);
        log.info("Approved evaluation: id={}", id);
        return Result.success(evaluation);
    }

    public Result<Evaluation> approveFallback(Long id, Throwable t) {
        log.error("Approve evaluation fallback: {}", t.getMessage());
        return Result.error("Approval service is busy, please try later");
    }

    @Override
    @SentinelResource(value = "rejectEvaluation", fallback = "rejectFallback")
    public Result<Evaluation> rejectEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.selectById(id);
        if (evaluation == null) {
            return Result.error("Evaluation not found");
        }
        evaluation.setStatus("REJECTED");
        evaluation.setUpdateTime(LocalDateTime.now());
        evaluationRepository.updateById(evaluation);
        log.info("Rejected evaluation: id={}", id);
        return Result.success(evaluation);
    }

    public Result<Evaluation> rejectFallback(Long id, Throwable t) {
        log.error("Reject evaluation fallback: {}", t.getMessage());
        return Result.error("Rejection service is busy, please try later");
    }

    @Override
    @SentinelResource(
        value = "listEvaluations",
        fallback = "listEvaluationsFallback",
        blockHandler = "listEvaluationsBlockHandler"
    )
    public Result<IPage<Evaluation>> listEvaluations(int page, int size, Long bookId, String status) {
        Page<Evaluation> pageParam = new Page<>(page, size);
        QueryWrapper<Evaluation> queryWrapper = new QueryWrapper<>();
        if (bookId != null) {
            queryWrapper.eq("book_id", bookId);
        }
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("create_time");
        IPage<Evaluation> result = evaluationRepository.selectPage(pageParam, queryWrapper);
        return Result.success(result);
    }

    public Result<IPage<Evaluation>> listEvaluationsFallback(int page, int size, Long bookId, String status, Throwable t) {
        log.error("List evaluations fallback: {}", t.getMessage());
        return Result.error("Query service is busy, please try later");
    }

    public Result<IPage<Evaluation>> listEvaluationsBlockHandler(int page, int size, Long bookId, String status, BlockException e) {
        log.warn("List evaluations blocked by Sentinel: {}", e.getClass().getSimpleName());
        return Result.error(429, "Too many query requests, please slow down");
    }

    @Override
    public Result<List<Evaluation>> getBookEvaluations(Long bookId) {
        QueryWrapper<Evaluation> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("book_id", bookId)
                .eq("status", "APPROVED")
                .orderByDesc("create_time");
        List<Evaluation> list = evaluationRepository.selectList(queryWrapper);
        return Result.success(list);
    }

    @Override
    public Result<Double> getAverageRating(Long bookId) {
        QueryWrapper<Evaluation> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("book_id", bookId)
                .eq("status", "APPROVED");
        List<Evaluation> evaluations = evaluationRepository.selectList(queryWrapper);

        double avgRating = evaluations.stream()
                .filter(e -> e.getRating() != null)
                .mapToDouble(Evaluation::getRating)
                .average()
                .orElse(0.0);

        log.info("Average rating for book {}: {}", bookId, avgRating);
        return Result.success(avgRating);
    }
}
