package com.inkasalud.ventasservice.dto;

import java.time.LocalDateTime;
import java.util.List;

public record VentaDto(
        Long id,
        LocalDateTime fecha,
        Long clienteId,
        Double total,
        List<DetalleVentaDto> detalles
) {
}
