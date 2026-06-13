package com.bookstore.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bookstore.common.dto.OrderDTO;
import com.bookstore.common.dto.Result;
import com.bookstore.user.entity.User;
import com.bookstore.user.feign.OrderFeignClient;
import com.bookstore.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OrderFeignClient orderFeignClient;

    public UserServiceImpl(UserRepository userRepository, OrderFeignClient orderFeignClient) {
        this.userRepository = userRepository;
        this.orderFeignClient = orderFeignClient;
    }

    @Override
    public Result<User> register(User user) {
        // Check if username already exists
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, user.getUsername());
        User existingUser = userRepository.selectOne(queryWrapper);
        if (existingUser != null) {
            return Result.error("Username already exists");
        }

        // Encrypt password using MD5 (simplified for demo)
        user.setPassword(md5(user.getPassword()));

        // Set default values
        if (user.getVip() == null) {
            user.setVip(false);
        }
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userRepository.insert(user);
        return Result.success(user);
    }

    @Override
    public Result<User> login(String username, String password) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userRepository.selectOne(queryWrapper);

        if (user == null) {
            return Result.error("User not found");
        }

        if (!user.getPassword().equals(md5(password))) {
            return Result.error("Invalid credentials");
        }

        return Result.success(user);
    }

    @Override
    public Result<User> getUserById(Long id) {
        User user = userRepository.selectById(id);
        if (user == null) {
            return Result.error("User not found");
        }
        return Result.success(user);
    }

    @Override
    public Result<User> updateUser(User user) {
        user.setUpdateTime(LocalDateTime.now());
        int rows = userRepository.updateById(user);
        if (rows == 0) {
            return Result.error("User not found");
        }
        return Result.success(userRepository.selectById(user.getId()));
    }

    @Override
    public Result<List<OrderDTO>> getUserOrders(Long userId) {
        return orderFeignClient.getUserOrders(userId);
    }

    @Override
    public Result<User> upgradeVip(Long userId) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            return Result.error("User not found");
        }
        user.setVip(true);
        user.setUpdateTime(LocalDateTime.now());
        userRepository.updateById(user);
        return Result.success(user);
    }

    /**
     * Simple MD5 encryption for demo purposes.
     * In production, use BCryptPasswordEncoder from Spring Security.
     */
    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }
}
