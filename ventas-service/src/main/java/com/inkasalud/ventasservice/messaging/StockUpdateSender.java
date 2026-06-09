package com.inkasalud.ventasservice.messaging;

import com.inkasalud.ventasservice.config.RabbitMQConfig;
import com.inkasalud.ventasservice.dto.StockUpdateMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;

@Component
public class StockUpdateSender {

    private static final Logger log = LoggerFactory.getLogger(StockUpdateSender.class);
    private final AmqpTemplate amqpTemplate;

    public StockUpdateSender(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    public void sendStockUpdate(Long productoId, Integer cantidad) {
        StockUpdateMessage message = new StockUpdateMessage(productoId, cantidad);
        amqpTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, message);
        log.info("Enviado mensaje de actualización de stock: productoId={}, cantidad={}", productoId, cantidad);
    }
}
