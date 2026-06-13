package com.bookstore.user.controller;

import com.bookstore.common.dto.Result;
import com.bookstore.user.entity.Address;
import com.bookstore.user.service.AddressService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 收货地址管理控制器
 * 提供用户收货地址的增删改查和默认地址设置功能
 */
@RestController
@RequestMapping("/address")
public class AddressController {

    private static final Logger log = LoggerFactory.getLogger(AddressController.class);

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    /**
     * 新增收货地址
     */
    @PostMapping
    public Result<Address> createAddress(@RequestBody Address address) {
        log.info("Create address for userId={}", address.getUserId());
        return addressService.createAddress(address);
    }

    /**
     * 更新收货地址
     */
    @PutMapping
    public Result<Address> updateAddress(@RequestBody Address address) {
        log.info("Update address id={}", address.getId());
        return addressService.updateAddress(address);
    }

    /**
     * 删除收货地址
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteAddress(@PathVariable Long id, @RequestParam Long userId) {
        log.info("Delete address id={}, userId={}", id, userId);
        return addressService.deleteAddress(id, userId);
    }

    /**
     * 查询用户的收货地址列表
     */
    @GetMapping("/user/{userId}")
    public Result<List<Address>> getUserAddresses(@PathVariable Long userId) {
        log.info("Get addresses for userId={}", userId);
        return addressService.getUserAddresses(userId);
    }

    /**
     * 根据ID查询收货地址
     */
    @GetMapping("/{id}")
    public Result<Address> getAddressById(@PathVariable Long id) {
        return addressService.getAddressById(id);
    }

    /**
     * 设置默认收货地址
     */
    @PutMapping("/{id}/default")
    public Result<Address> setDefaultAddress(@PathVariable Long id, @RequestParam Long userId) {
        log.info("Set default address id={}, userId={}", id, userId);
        return addressService.setDefaultAddress(id, userId);
    }
}
