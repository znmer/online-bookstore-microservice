package com.bookstore.user.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookstore.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository extends BaseMapper<User> {
}
