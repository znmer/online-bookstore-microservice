package com.bookstore.order.service;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookstore.common.dto.BookDTO;
import com.bookstore.common.dto.Result;
import com.bookstore.order.entity.Order;
import com.bookstore.order.feign.BookFeignClient;
import com.bookstore.order.feign.UserFeignClient;
import com.bookstore.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final BookFeignClient bookFeignClient;
    private final UserFeignClient userFeignClient;
    private final StreamBridge streamBridge;

    public OrderServiceImpl(OrderRepository orderRepository,
                            BookFeignClient bookFeignClient,
                            UserFeignClient userFeignClient,
                            StreamBridge streamBridge) {
        this.orderRepository = orderRepository;
        this.bookFeignClient = bookFeignClient;
        this.userFeignClient = userFeignClient;
        this.streamBridge = streamBridge;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @SentinelResource(
        value = "createOrder",
        fallback = "createOrderFallback",
        blockHandler = "createOrderBlockHandler"
    )
    public Result<Order> createOrder(Order order) {
        Result<BookDTO> bookResult = bookFeignClient.getBookById(order.getBookId());
        if (bookResult == null || !bookResult.isSuccess() || bookResult.getData() == null) {
            return Result.error("Book not found or service unavailable");
        }
        BookDTO book = bookResult.getData();
        if (book.getStock() < order.getQuantity()) {
            return Result.error("Insufficient stock");
        }

        String orderNo = "ORD" + System.currentTimeMillis()
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        order.setOrderNo(orderNo);

        BigDecimal totalPrice = book.getPrice().multiply(BigDecimal.valueOf(order.getQuantity()));
        order.setTotalPrice(totalPrice);

        order.setStatus("PENDING");
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());

        orderRepository.insert(order);

        bookFeignClient.updateStock(order.getBookId(), -order.getQuantity());

        sendOrderEvent(order);

        return Result.success(order);
    }

    /**
     * createOrder 的 fallback 方法：业务异常时调用
     */
    public Result<Order> createOrderFallback(Order order, Throwable t) {
        log.error("Order creation failed due to business error: {}", t.getMessage());
        return Result.error("Order service is busy, please try again later: " + t.getMessage());
    }

    /**
     * createOrder 的 blockHandler 方法：限流/熔断时调用
     */
    public Result<Order> createOrderBlockHandler(Order order, BlockException e) {
        log.warn("Order creation blocked by Sentinel: {}", e.getClass().getSimpleName());
        return Result.error(429, "Order creation rate limit exceeded, please try later");
    }

    @Override
    @SentinelResource(value = "getOrder", fallback = "getOrderFallback")
    public Result<Order> getOrder(Long id) {
        Order order = orderRepository.selectById(id);
        if (order == null) {
            return Result.error("Order not found");
        }
        return Result.success(order);
    }

    public Result<Order> getOrderFallback(Long id, Throwable t) {
        log.error("Get order failed: {}", t.getMessage());
        return Result.error("Query service is busy, please try later");
    }

    @Override
    public Result<Order> getOrderByNo(String orderNo) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getOrderNo, orderNo);
        Order order = orderRepository.selectOne(wrapper);
        if (order == null) {
            return Result.error("Order not found");
        }
        return Result.success(order);
    }

    @Override
    @SentinelResource(value = "listOrders", fallback = "listOrdersFallback")
    public Result<IPage<Order>> listOrders(int page, int size, Long userId, String status) {
        Page<Order> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();

        if (userId != null) {
            wrapper.eq(Order::getUserId, userId);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq(Order::getStatus, status);
        }

        wrapper.orderByDesc(Order::getCreateTime);
        IPage<Order> result = orderRepository.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    public Result<IPage<Order>> listOrdersFallback(int page, int size, Long userId, String status, Throwable t) {
        log.error("List orders failed: {}", t.getMessage());
        return Result.error("Query service is busy, please try later");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @SentinelResource(
        value = "cancelOrder",
        fallback = "cancelOrderFallback",
        blockHandler = "cancelOrderBlockHandler"
    )
    public Result<Order> cancelOrder(Long id) {
        Order order = orderRepository.selectById(id);
        if (order == null) {
            return Result.error("Order not found");
        }
        if (!"PENDING".equals(order.getStatus())) {
            return Result.error("Only pending orders can be cancelled");
        }

        order.setStatus("CANCELLED");
        order.setUpdateTime(LocalDateTime.now());
        orderRepository.updateById(order);

        bookFeignClient.updateStock(order.getBookId(), order.getQuantity());

        return Result.success(order);
    }

    public Result<Order> cancelOrderFallback(Long id, Throwable t) {
        log.error("Cancel order failed: {}", t.getMessage());
        return Result.error("Cancellation service is busy, please try later");
    }

    public Result<Order> cancelOrderBlockHandler(Long id, BlockException e) {
        log.warn("Cancel order blocked by Sentinel: {}", e.getClass().getSimpleName());
        return Result.error(429, "Cancellation rate limit exceeded, please try later");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Order> updateStatus(Long id, String status) {
        Order order = orderRepository.selectById(id);
        if (order == null) {
            return Result.error("Order not found");
        }

        order.setStatus(status);
        order.setUpdateTime(LocalDateTime.now());
        orderRepository.updateById(order);

        return Result.success(order);
    }

    @Override
    public Result<List<Order>> getOrdersByUserId(Long userId) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        wrapper.orderByDesc(Order::getCreateTime);
        List<Order> orders = orderRepository.selectList(wrapper);
        return Result.success(orders);
    }

    private void sendOrderEvent(Order order) {
        try {
            streamBridge.send("orderEventOutput", order);
            log.info("Order event sent successfully for order: {}", order.getOrderNo());
        } catch (Exception e) {
            log.error("Failed to send order event for order: {}", order.getOrderNo(), e);
        }
    }
}
