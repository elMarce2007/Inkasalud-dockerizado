package com.inkasalud.catalogoservice.service;

import com.inkasalud.catalogoservice.dto.ProductoDto;

import java.util.List;

public interface ProductoService {
    List<ProductoDto> listar();
    ProductoDto obtener(Long id);
    ProductoDto crear(ProductoDto dto);
    ProductoDto actualizar(Long id, ProductoDto dto);
    void eliminar(Long id);
}
