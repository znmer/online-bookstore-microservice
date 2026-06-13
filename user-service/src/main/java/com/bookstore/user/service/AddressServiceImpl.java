package com.bookstore.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bookstore.common.dto.Result;
import com.bookstore.user.entity.Address;
import com.bookstore.user.repository.AddressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 收货地址服务实现
 */
@Service
public class AddressServiceImpl implements AddressService {

    private static final Logger log = LoggerFactory.getLogger(AddressServiceImpl.class);

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Address> createAddress(Address address) {
        // 如果是默认地址，先取消该用户的其他默认地址
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            clearDefaultAddress(address.getUserId());
        }

        address.setCreateTime(LocalDateTime.now());
        address.setUpdateTime(LocalDateTime.now());
        addressRepository.insert(address);

        // 如果该用户还没有任何地址，自动设为默认
        if (address.getIsDefault() == null) {
            LambdaQueryWrapper<Address> countQuery = new LambdaQueryWrapper<>();
            countQuery.eq(Address::getUserId, address.getUserId());
            long count = addressRepository.selectCount(countQuery);
            address.setIsDefault(count == 1);
            addressRepository.updateById(address);
        }

        log.info("Created address: id={}, userId={}, receiver={}",
            address.getId(), address.getUserId(), address.getReceiverName());
        return Result.success(address);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Address> updateAddress(Address address) {
        Address existing = addressRepository.selectById(address.getId());
        if (existing == null) {
            return Result.error("Address not found");
        }
        if (!existing.getUserId().equals(address.getUserId())) {
            return Result.error("Address does not belong to this user");
        }

        // 如果设置为默认，先清除其他默认地址
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            clearDefaultAddress(address.getUserId());
        }

        address.setUpdateTime(LocalDateTime.now());
        addressRepository.updateById(address);
        log.info("Updated address: id={}", address.getId());
        return Result.success(addressRepository.selectById(address.getId()));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteAddress(Long id, Long userId) {
        Address address = addressRepository.selectById(id);
        if (address == null) {
            return Result.error("Address not found");
        }
        if (!address.getUserId().equals(userId)) {
            return Result.error("Address does not belong to this user");
        }

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.deleteById(id);

        // 如果删除的是默认地址，将最近的一个地址设为默认
        if (wasDefault) {
            LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Address::getUserId, userId)
                   .orderByDesc(Address::getCreateTime)
                   .last("LIMIT 1");
            Address latest = addressRepository.selectOne(wrapper);
            if (latest != null) {
                latest.setIsDefault(true);
                latest.setUpdateTime(LocalDateTime.now());
                addressRepository.updateById(latest);
            }
        }

        log.info("Deleted address: id={}", id);
        return Result.success();
    }

    @Override
    public Result<List<Address>> getUserAddresses(Long userId) {
        LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Address::getUserId, userId)
               .orderByDesc(Address::getIsDefault)
               .orderByDesc(Address::getCreateTime);
        List<Address> addresses = addressRepository.selectList(wrapper);
        return Result.success(addresses);
    }

    @Override
    public Result<Address> getAddressById(Long id) {
        Address address = addressRepository.selectById(id);
        if (address == null) {
            return Result.error("Address not found");
        }
        return Result.success(address);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Address> setDefaultAddress(Long id, Long userId) {
        Address address = addressRepository.selectById(id);
        if (address == null) {
            return Result.error("Address not found");
        }
        if (!address.getUserId().equals(userId)) {
            return Result.error("Address does not belong to this user");
        }

        clearDefaultAddress(userId);
        address.setIsDefault(true);
        address.setUpdateTime(LocalDateTime.now());
        addressRepository.updateById(address);

        log.info("Set default address: id={}, userId={}", id, userId);
        return Result.success(address);
    }

    /**
     * 清除用户的所有默认地址标记
     */
    private void clearDefaultAddress(Long userId) {
        LambdaQueryWrapper<Address> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Address::getUserId, userId)
               .eq(Address::getIsDefault, true);
        Address defaultAddr = addressRepository.selectOne(wrapper);
        if (defaultAddr != null) {
            defaultAddr.setIsDefault(false);
            defaultAddr.setUpdateTime(LocalDateTime.now());
            addressRepository.updateById(defaultAddr);
        }
    }
}
