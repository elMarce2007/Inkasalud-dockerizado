package com.inkasalud.clienteservice.dto;

public record ClienteDto(
        Long id,
        String nombres,
        String apellidos,
        String dni,
        String telefono,
        String email
) {
}
