package com.bookstore.order.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.bookstore.common.dto.Result;
import com.bookstore.order.entity.Order;

import java.util.List;

public interface OrderService {

    Result<Order> createOrder(Order order);

    Result<Order> getOrder(Long id);

    Result<Order> getOrderByNo(String orderNo);

    Result<IPage<Order>> listOrders(int page, int size, Long userId, String status);

    Result<Order> cancelOrder(Long id);

    Result<Order> updateStatus(Long id, String status);

    Result<List<Order>> getOrdersByUserId(Long userId);
}
