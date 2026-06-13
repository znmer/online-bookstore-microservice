package com.bookstore.book.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookstore.book.entity.Book;
import com.bookstore.book.service.BookService;
import com.bookstore.common.dto.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    private BookService bookService;

    @Value("${server.port:8081}")
    private int serverPort;

    @Value("${spring.application.name:book-service}")
    private String applicationName;

    @GetMapping("/instance")
    public Result<Map<String, Object>> instanceInfo() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", applicationName);
        info.put("port", serverPort);
        info.put("instance", applicationName + "-" + serverPort);
        info.put("timestamp", System.currentTimeMillis());
        return Result.success(info);
    }

    @GetMapping("/list")
    public Result<Page<Book>> listBooks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        return bookService.listBooks(page, size, category, keyword);
    }

    @GetMapping("/{id}")
    public Result<Book> getBook(@PathVariable Long id) {
        return bookService.getBook(id);
    }

    @PostMapping
    public Result<Book> createBook(@RequestBody Book book) {
        return bookService.createBook(book);
    }

    @PutMapping
    public Result<Book> updateBook(@RequestBody Book book) {
        return bookService.updateBook(book);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteBook(@PathVariable Long id) {
        return bookService.deleteBook(id);
    }

    @PutMapping("/stock/{id}")
    public Result<Void> updateStock(@PathVariable Long id, @RequestParam int quantity) {
        return bookService.updateStock(id, quantity);
    }

    @GetMapping("/category/{category}")
    public Result<List<Book>> listByCategory(@PathVariable String category) {
        return bookService.listByCategory(category);
    }
}
