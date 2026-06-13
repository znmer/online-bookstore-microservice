package com.bookstore.order.config;

import com.bookstore.order.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@Component
public class OrderEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(OrderEventPublisher.class);

    private final StreamBridge streamBridge;

    public OrderEventPublisher(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    public void sendOrderEvent(Order order) {
        try {
            Message<Order> message = MessageBuilder.withPayload(order)
                    .setHeader("routingKey", "evaluation.order")
                    .build();

            streamBridge.send("orderEventOutput", message);
            log.info("Order event published successfully for order: {}", order.getOrderNo());
        } catch (Exception e) {
            log.error("Failed to publish order event for order: {}", order.getOrderNo(), e);
        }
    }
}
