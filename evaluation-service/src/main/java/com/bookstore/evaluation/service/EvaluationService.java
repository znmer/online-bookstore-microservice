package com.bookstore.evaluation.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.bookstore.common.dto.Result;
import com.bookstore.evaluation.entity.Evaluation;

import java.util.List;

public interface EvaluationService {

    Result<Evaluation> createEvaluation(Evaluation evaluation);

    Result<Evaluation> approveEvaluation(Long id);

    Result<Evaluation> rejectEvaluation(Long id);

    Result<IPage<Evaluation>> listEvaluations(int page, int size, Long bookId, String status);

    Result<List<Evaluation>> getBookEvaluations(Long bookId);

    Result<Double> getAverageRating(Long bookId);
}
