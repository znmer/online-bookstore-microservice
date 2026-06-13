package com.bookstore.order.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.bookstore.common.dto.Result;
import com.bookstore.order.entity.Order;
import com.bookstore.order.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Result<Order> createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @GetMapping("/{id}")
    public Result<Order> getOrder(@PathVariable("id") Long id) {
        return orderService.getOrder(id);
    }

    @GetMapping("/no/{orderNo}")
    public Result<Order> getOrderByNo(@PathVariable("orderNo") String orderNo) {
        return orderService.getOrderByNo(orderNo);
    }

    @GetMapping("/list")
    public Result<IPage<Order>> listOrders(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "status", required = false) String status) {
        return orderService.listOrders(page, size, userId, status);
    }

    @PutMapping("/{id}/cancel")
    public Result<Order> cancelOrder(@PathVariable("id") Long id) {
        return orderService.cancelOrder(id);
    }

    @PutMapping("/{id}/status")
    public Result<Order> updateStatus(@PathVariable("id") Long id,
                                       @RequestParam("status") String status) {
        return orderService.updateStatus(id, status);
    }

    @GetMapping("/user/{userId}")
    public Result<List<Order>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        return orderService.getOrdersByUserId(userId);
    }
}
