package com.bookstore.user.service;

import com.bookstore.common.dto.OrderDTO;
import com.bookstore.common.dto.Result;
import com.bookstore.user.entity.User;

import java.util.List;

public interface UserService {

    Result<User> register(User user);

    Result<User> login(String username, String password);

    Result<User> getUserById(Long id);

    Result<User> updateUser(User user);

    Result<List<OrderDTO>> getUserOrders(Long userId);

    Result<User> upgradeVip(Long userId);
}
