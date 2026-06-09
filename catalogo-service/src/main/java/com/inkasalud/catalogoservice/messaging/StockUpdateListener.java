package com.inkasalud.catalogoservice.messaging;

import com.inkasalud.catalogoservice.config.RabbitMQConfig;
import com.inkasalud.catalogoservice.dto.StockUpdateMessage;
import com.inkasalud.catalogoservice.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class StockUpdateListener {

    private static final Logger log = LoggerFactory.getLogger(StockUpdateListener.class);
    private final ProductoRepository productoRepository;

    public StockUpdateListener(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void handleStockUpdate(StockUpdateMessage message) {
        log.info("Recibido mensaje de actualización de stock: productoId={}, cantidad={}",
                message.productoId(), message.cantidad());
        productoRepository.findById(message.productoId()).ifPresentOrElse(
                producto -> {
                    int nuevoStock = producto.getStock() - message.cantidad();
                    producto.setStock(Math.max(nuevoStock, 0));
                    productoRepository.save(producto);
                    log.info("Stock actualizado para producto {}: nuevo stock = {}",
                            message.productoId(), producto.getStock());
                },
                () -> log.warn("Producto no encontrado con id: {}", message.productoId())
        );
    }
}
