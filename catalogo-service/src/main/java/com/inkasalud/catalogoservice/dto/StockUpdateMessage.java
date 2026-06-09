package com.inkasalud.catalogoservice.dto;

import java.io.Serializable;

public record StockUpdateMessage(Long productoId, Integer cantidad) implements Serializable {
}
