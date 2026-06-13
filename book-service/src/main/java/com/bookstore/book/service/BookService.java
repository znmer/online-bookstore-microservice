package com.bookstore.book.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookstore.book.entity.Book;
import com.bookstore.common.dto.Result;

import java.util.List;

public interface BookService {

    Result<Page<Book>> listBooks(int page, int size, String category, String keyword);

    Result<Book> getBook(Long id);

    Result<Book> createBook(Book book);

    Result<Book> updateBook(Book book);

    Result<Void> deleteBook(Long id);

    Result<Void> updateStock(Long id, int quantity);

    Result<List<Book>> listByCategory(String category);
}
