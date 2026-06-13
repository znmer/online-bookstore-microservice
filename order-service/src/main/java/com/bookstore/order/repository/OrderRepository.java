package com.bookstore.order.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookstore.order.entity.Order;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderRepository extends BaseMapper<Order> {
}
