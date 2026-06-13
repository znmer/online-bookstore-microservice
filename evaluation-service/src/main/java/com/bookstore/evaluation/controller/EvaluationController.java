package com.bookstore.evaluation.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.bookstore.common.dto.Result;
import com.bookstore.evaluation.entity.Evaluation;
import com.bookstore.evaluation.service.EvaluationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluation")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    public Result<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        return evaluationService.createEvaluation(evaluation);
    }

    @PutMapping("/{id}/approve")
    public Result<Evaluation> approveEvaluation(@PathVariable Long id) {
        return evaluationService.approveEvaluation(id);
    }

    @PutMapping("/{id}/reject")
    public Result<Evaluation> rejectEvaluation(@PathVariable Long id) {
        return evaluationService.rejectEvaluation(id);
    }

    @GetMapping("/list")
    public Result<IPage<Evaluation>> listEvaluations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) String status) {
        return evaluationService.listEvaluations(page, size, bookId, status);
    }

    @GetMapping("/book/{bookId}")
    public Result<List<Evaluation>> getBookEvaluations(@PathVariable Long bookId) {
        return evaluationService.getBookEvaluations(bookId);
    }

    @GetMapping("/book/{bookId}/rating")
    public Result<Double> getAverageRating(@PathVariable Long bookId) {
        return evaluationService.getAverageRating(bookId);
    }
}
