package com.bookstore.evaluation.config;

import com.bookstore.common.dto.OrderDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.util.function.Consumer;

@Configuration
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    @Bean
    public Consumer<Message<OrderDTO>> orderEventInput() {
        return msg -> {
            OrderDTO order = msg.getPayload();
            log.info("Received order event via Spring Cloud Stream: {}", order);
            log.info("Order details - orderId: {}, userId: {}, status: {}",
                order.getId(), order.getUserId(), order.getStatus());
            log.info("Creating pending evaluation notification for user: {} about order: {}",
                order.getUserId(), order.getId());
        };
    }
}
