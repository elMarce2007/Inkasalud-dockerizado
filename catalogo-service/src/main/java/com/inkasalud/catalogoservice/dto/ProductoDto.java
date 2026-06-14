package com.inkasalud.catalogoservice.dto;

public record ProductoDto(
        Long id,
        String nombre,
        String descripcion,
        Double precio,
        Integer stock,
        Long categoriaId
) {
}
