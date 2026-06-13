package com.bookstore.book.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookstore.book.entity.Book;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends BaseMapper<Book> {
}
