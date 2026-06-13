package com.bookstore.user.service;

import com.bookstore.common.dto.Result;
import com.bookstore.user.entity.Address;

import java.util.List;

/**
 * 收货地址服务接口
 */
public interface AddressService {

    /**
     * 新增收货地址
     */
    Result<Address> createAddress(Address address);

    /**
     * 更新收货地址
     */
    Result<Address> updateAddress(Address address);

    /**
     * 删除收货地址
     */
    Result<Void> deleteAddress(Long id, Long userId);

    /**
     * 查询用户的收货地址列表
     */
    Result<List<Address>> getUserAddresses(Long userId);

    /**
     * 根据ID查询收货地址
     */
    Result<Address> getAddressById(Long id);

    /**
     * 设置默认收货地址
     */
    Result<Address> setDefaultAddress(Long id, Long userId);
}
