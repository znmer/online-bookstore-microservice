package com.bookstore.order.feign;

import com.bookstore.common.dto.Result;
import com.bookstore.common.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserFeignClient {

    @GetMapping("/user/{id}")
    Result<UserDTO> getUserById(@PathVariable("id") Long id);
}
