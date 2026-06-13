-- ============================================
-- 在线图书商城微服务系统 - 数据库初始化脚本
-- ============================================

-- 图书数据库
CREATE DATABASE IF NOT EXISTS bookstore_book DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore_book;

CREATE TABLE IF NOT EXISTS book (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '书名',
    author VARCHAR(100) COMMENT '作者',
    isbn VARCHAR(20) COMMENT 'ISBN号',
    publisher VARCHAR(100) COMMENT '出版社',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    stock INT DEFAULT 0 COMMENT '库存',
    category VARCHAR(50) COMMENT '分类',
    description TEXT COMMENT '描述',
    cover_image VARCHAR(500) COMMENT '封面图片URL',
    sales_count INT DEFAULT 0 COMMENT '销量',
    enabled TINYINT(1) DEFAULT 1 COMMENT '是否上架',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书表';

-- 插入示例图书数据
INSERT INTO book (title, author, isbn, publisher, price, stock, category, description, sales_count) VALUES
('深入理解Java虚拟机', '周志明', '9787111641247', '机械工业出版社', 129.00, 50, '技术', 'Java开发者必读经典', 1200),
('Spring实战 第6版', '克雷格·沃斯', '9787115546074', '人民邮电出版社', 89.00, 80, '技术', 'Spring框架权威指南', 800),
('微服务架构设计模式', '克里斯·理查森', '9787111617389', '机械工业出版社', 99.00, 60, '技术', '微服务架构最佳实践', 650),
('Java核心技术 卷I', '凯·S·霍斯特曼', '9787115548009', '机械工业出版社', 119.00, 40, '技术', 'Java基础权威教程', 500),
('三体', '刘慈欣', '9787536692930', '重庆出版社', 68.00, 100, '小说', '科幻巨著', 5000),
('活着', '余华', '9787506365437', '作家出版社', 45.00, 90, '小说', '余华代表作', 3500),
('百年孤独', '加西亚·马尔克斯', '9787544253994', '南海出版公司', 55.00, 70, '小说', '魔幻现实主义经典', 2800),
('算法导论', 'CLRS', '9787111407010', '机械工业出版社', 128.00, 30, '技术', '算法领域圣经', 400),
('设计模式', 'GoF', '9787111618331', '机械工业出版社', 79.00, 45, '技术', '面向对象设计模式经典', 600),
('人类简史', '尤瓦尔·赫拉利', '9787508672069', '中信出版社', 68.00, 85, '社科', '从动物到上帝', 3200);

-- 用户数据库
CREATE DATABASE IF NOT EXISTS bookstore_user DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore_user;

CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    real_name VARCHAR(50),
    address VARCHAR(500),
    vip TINYINT(1) DEFAULT 0 COMMENT '是否VIP',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认管理员和测试用户
INSERT INTO user (username, password, email, phone, real_name, address, vip) VALUES
('admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin@bookstore.com', '13800138000', '管理员', '北京市朝阳区', 1),
('zhangsan', 'e10adc3949ba59abbe56e057f20f883e', 'zhangsan@test.com', '13912345678', '张三', '上海市浦东新区', 0),
('lisi', 'e10adc3949ba59abbe56e057f20f883e', 'lisi@test.com', '13687654321', '李四', '广州市天河区', 0);
-- 密码为 '123456' 的 MD5

-- 订单数据库
CREATE DATABASE IF NOT EXISTS bookstore_order DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore_order;

CREATE TABLE IF NOT EXISTS order_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(64) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    book_id BIGINT NOT NULL COMMENT '图书ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    total_price DECIMAL(10,2) NOT NULL COMMENT '总价',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING/PAID/SHIPPED/DELIVERED/CANCELLED',
    receiver_name VARCHAR(50) COMMENT '收货人',
    receiver_phone VARCHAR(20) COMMENT '收货电话',
    receiver_address VARCHAR(500) COMMENT '收货地址',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 评价数据库
CREATE DATABASE IF NOT EXISTS bookstore_evaluation DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore_evaluation;

CREATE TABLE IF NOT EXISTS evaluation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    book_id BIGINT NOT NULL COMMENT '图书ID',
    rating INT NOT NULL COMMENT '评分 1-5',
    content TEXT COMMENT '评价内容',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING/APPROVED/REJECTED',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- 插入示例评价
INSERT INTO evaluation (user_id, book_id, rating, content, status, like_count) VALUES
(1, 1, 5, '非常经典的Java书籍，深入浅出', 'APPROVED', 42),
(2, 1, 4, '内容很好，值得一读', 'APPROVED', 15),
(2, 5, 5, '三体太震撼了！', 'APPROVED', 100),
(3, 6, 5, '余华的作品让我感动', 'APPROVED', 78),
(3, 10, 4, '人类简史视角独特', 'PENDING', 0);

-- ============================================
-- 收货地址表（用户地址管理）
-- ============================================
USE bookstore_user;

CREATE TABLE IF NOT EXISTS address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    province VARCHAR(50) COMMENT '省',
    city VARCHAR(50) COMMENT '市',
    district VARCHAR(50) COMMENT '区/县',
    detail_address VARCHAR(500) NOT NULL COMMENT '详细地址',
    zip_code VARCHAR(10) COMMENT '邮编',
    is_default TINYINT(1) DEFAULT 0 COMMENT '是否默认地址',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- 插入示例地址数据
INSERT INTO address (user_id, receiver_name, receiver_phone, province, city, district, detail_address, zip_code, is_default) VALUES
(1, '管理员', '13800138000', '北京市', '北京市', '朝阳区', '建国路88号SOHO现代城A座1208', '100022', 1),
(2, '张三', '13912345678', '上海市', '上海市', '浦东新区', '张江高科技园区博云路2号', '201203', 1),
(3, '李四', '13687654321', '广东省', '广州市', '天河区', '天河路385号太古汇一座3001', '510620', 1);
