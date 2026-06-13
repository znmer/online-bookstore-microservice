package com.bookstore.user.feign;

import com.bookstore.common.dto.OrderDTO;
import com.bookstore.common.dto.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "order-service")
public interface OrderFeignClient {

    @GetMapping("/order/user/{userId}")
    Result<List<OrderDTO>> getUserOrders(@PathVariable("userId") Long userId);
}
