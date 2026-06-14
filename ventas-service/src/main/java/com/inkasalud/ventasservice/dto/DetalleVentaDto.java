package com.inkasalud.ventasservice.dto;

public record DetalleVentaDto(
        Long id,
        Long productoId,
        Integer cantidad,
        Double precioUnitario,
        Double subtotal
) {
}
