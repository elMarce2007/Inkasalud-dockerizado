package com.inkasalud.authservice.dto;

public record LoginResponse(String token, String username, String rol) {
}
