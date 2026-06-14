package com.inkasalud.authservice.controller;

import com.inkasalud.authservice.dto.LoginRequest;
import com.inkasalud.authservice.dto.LoginResponse;
import com.inkasalud.authservice.dto.RegistroRequest;
import com.inkasalud.authservice.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registro(@RequestBody RegistroRequest request) {
        authService.registrar(request);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
