package com.bookstore.evaluation.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookstore.evaluation.entity.Evaluation;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EvaluationRepository extends BaseMapper<Evaluation> {
}
