package com.inkasalud.ventasservice.dto;

import java.io.Serializable;

public record StockUpdateMessage(Long productoId, Integer cantidad) implements Serializable {
}
