package com.inkasalud.ventasservice.service;

import com.inkasalud.ventasservice.dto.VentaDto;

import java.util.List;

public interface VentaService {
    List<VentaDto> listar();
    VentaDto obtener(Long id);
    VentaDto crear(VentaDto dto);
}
