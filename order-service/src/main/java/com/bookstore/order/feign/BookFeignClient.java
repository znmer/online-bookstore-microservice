package com.bookstore.order.feign;

import com.bookstore.common.dto.BookDTO;
import com.bookstore.common.dto.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "book-service")
public interface BookFeignClient {

    @GetMapping("/book/{id}")
    Result<BookDTO> getBookById(@PathVariable("id") Long id);

    @PutMapping("/book/stock/{id}")
    Result<Void> updateStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity);
}
