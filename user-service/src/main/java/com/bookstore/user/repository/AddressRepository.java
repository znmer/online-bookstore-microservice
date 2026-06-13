package com.bookstore.user.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookstore.user.entity.Address;
import org.apache.ibatis.annotations.Mapper;

/**
 * 收货地址数据访问层
 */
@Mapper
public interface AddressRepository extends BaseMapper<Address> {
}
