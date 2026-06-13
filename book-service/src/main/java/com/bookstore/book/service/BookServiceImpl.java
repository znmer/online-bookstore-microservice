package com.bookstore.book.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookstore.book.entity.Book;
import com.bookstore.book.repository.BookRepository;
import com.bookstore.common.dto.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private static final Logger log = LoggerFactory.getLogger(BookServiceImpl.class);

    @Autowired
    private BookRepository bookRepository;

    @Override
    public Result<Page<Book>> listBooks(int page, int size, String category, String keyword) {
        Page<Book> pageParam = new Page<>(page, size);
        QueryWrapper<Book> queryWrapper = new QueryWrapper<>();

        if (category != null && !category.isEmpty()) {
            queryWrapper.eq("category", category);
        }
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.like("title", keyword);
        }
        queryWrapper.orderByDesc("create_time");

        Page<Book> result = bookRepository.selectPage(pageParam, queryWrapper);
        log.info("List books - page: {}, size: {}, category: {}, keyword: {}, total: {}",
                page, size, category, keyword, result.getTotal());
        return Result.success(result);
    }

    @Override
    public Result<Book> getBook(Long id) {
        Book book = bookRepository.selectById(id);
        if (book == null) {
            log.warn("Book not found, id: {}", id);
            return Result.error("Book not found");
        }
        log.info("Get book - id: {}, title: {}", id, book.getTitle());
        return Result.success(book);
    }

    @Override
    public Result<Book> createBook(Book book) {
        book.setCreateTime(LocalDateTime.now());
        book.setUpdateTime(LocalDateTime.now());
        if (book.getSalesCount() == null) {
            book.setSalesCount(0);
        }
        if (book.getEnabled() == null) {
            book.setEnabled(true);
        }
        int rows = bookRepository.insert(book);
        if (rows > 0) {
            log.info("Create book success - id: {}, title: {}", book.getId(), book.getTitle());
            return Result.success(book);
        }
        log.error("Create book failed - title: {}", book.getTitle());
        return Result.error("Create book failed");
    }

    @Override
    public Result<Book> updateBook(Book book) {
        if (book.getId() == null) {
            return Result.error("Book id is required");
        }
        Book existing = bookRepository.selectById(book.getId());
        if (existing == null) {
            log.warn("Book not found for update, id: {}", book.getId());
            return Result.error("Book not found");
        }
        book.setUpdateTime(LocalDateTime.now());
        // preserve createTime
        book.setCreateTime(existing.getCreateTime());
        int rows = bookRepository.updateById(book);
        if (rows > 0) {
            log.info("Update book success - id: {}, title: {}", book.getId(), book.getTitle());
            return Result.success(bookRepository.selectById(book.getId()));
        }
        log.error("Update book failed - id: {}", book.getId());
        return Result.error("Update book failed");
    }

    @Override
    public Result<Void> deleteBook(Long id) {
        Book existing = bookRepository.selectById(id);
        if (existing == null) {
            log.warn("Book not found for delete, id: {}", id);
            return Result.error("Book not found");
        }
        int rows = bookRepository.deleteById(id);
        if (rows > 0) {
            log.info("Delete book success - id: {}, title: {}", id, existing.getTitle());
            return Result.success();
        }
        log.error("Delete book failed - id: {}", id);
        return Result.error("Delete book failed");
    }

    @Override
    public Result<Void> updateStock(Long id, int quantity) {
        Book existing = bookRepository.selectById(id);
        if (existing == null) {
            log.warn("Book not found for stock update, id: {}", id);
            return Result.error("Book not found");
        }
        int newStock = existing.getStock() + quantity;
        if (newStock < 0) {
            log.warn("Insufficient stock for book id: {}, current: {}, requested change: {}",
                    id, existing.getStock(), quantity);
            return Result.error("Insufficient stock");
        }
        existing.setStock(newStock);
        existing.setUpdateTime(LocalDateTime.now());
        int rows = bookRepository.updateById(existing);
        if (rows > 0) {
            log.info("Update stock success - id: {}, new stock: {}", id, newStock);
            return Result.success();
        }
        log.error("Update stock failed - id: {}", id);
        return Result.error("Update stock failed");
    }

    @Override
    public Result<List<Book>> listByCategory(String category) {
        QueryWrapper<Book> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("category", category);
        queryWrapper.orderByDesc("sales_count");
        List<Book> books = bookRepository.selectList(queryWrapper);
        log.info("List by category - category: {}, count: {}", category, books.size());
        return Result.success(books);
    }
}
