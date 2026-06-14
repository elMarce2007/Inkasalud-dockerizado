package com.inkasalud.clienteservice.service;

import com.inkasalud.clienteservice.dto.ClienteDto;

import java.util.List;

public interface ClienteService {
    List<ClienteDto> listar();
    ClienteDto obtener(Long id);
    ClienteDto crear(ClienteDto dto);
    ClienteDto actualizar(Long id, ClienteDto dto);
    void eliminar(Long id);
}
