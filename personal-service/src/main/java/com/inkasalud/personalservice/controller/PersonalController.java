package com.inkasalud.personalservice.controller;

import com.inkasalud.personalservice.dto.PersonalDto;
import com.inkasalud.personalservice.service.PersonalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
public class PersonalController {

    private final PersonalService personalService;

    public PersonalController(PersonalService personalService) {
        this.personalService = personalService;
    }

    @GetMapping
    public ResponseEntity<List<PersonalDto>> listar() {
        return ResponseEntity.ok(personalService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalDto> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(personalService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<PersonalDto> crear(@RequestBody PersonalDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personalService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonalDto> actualizar(@PathVariable Long id, @RequestBody PersonalDto dto) {
        return ResponseEntity.ok(personalService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        personalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
