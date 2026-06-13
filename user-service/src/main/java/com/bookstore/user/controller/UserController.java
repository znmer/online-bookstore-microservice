package com.bookstore.user.controller;

import com.bookstore.common.dto.OrderDTO;
import com.bookstore.common.dto.Result;
import com.bookstore.user.entity.User;
import com.bookstore.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public Result<User> register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Result<User> login(@RequestParam String username, @RequestParam String password) {
        return userService.login(username, password);
    }

    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping
    public Result<User> updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @GetMapping("/{id}/orders")
    public Result<List<OrderDTO>> getUserOrders(@PathVariable Long id) {
        return userService.getUserOrders(id);
    }

    @PutMapping("/{id}/vip")
    public Result<User> upgradeVip(@PathVariable Long id) {
        return userService.upgradeVip(id);
    }
}
