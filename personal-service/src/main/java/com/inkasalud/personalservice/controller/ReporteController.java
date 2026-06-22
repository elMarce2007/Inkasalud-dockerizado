package com.inkasalud.personalservice.controller;

import com.inkasalud.personalservice.entity.Personal;
import com.inkasalud.personalservice.repository.PersonalRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/personal/reporte")
public class ReporteController {

    private static final String CARPETA = "reportes";

    private final PersonalRepository personalRepository;

    public ReporteController(PersonalRepository personalRepository) {
        this.personalRepository = personalRepository;
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> generarReporteCsv() throws IOException {

        List<Personal> lista = personalRepository.findAll();

        String marca = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String nombreArchivo = "personal_" + marca + ".csv";
        Path ruta = Paths.get(CARPETA, nombreArchivo);

        Files.createDirectories(ruta.getParent());

        try (BufferedWriter bw = Files.newBufferedWriter(ruta, StandardCharsets.UTF_8)) {
            bw.write("id,nombres,apellidos,cargo,email");
            bw.newLine();

            for (Personal p : lista) {
                bw.write(p.getId() + "," + p.getNombres() + "," + p.getApellidos()
                        + "," + p.getCargo() + "," + p.getEmail());
                bw.newLine();
            }
        }

        byte[] contenido = Files.readAllBytes(ruta);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + nombreArchivo)
                .body(contenido);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<String>> listarReportes() throws IOException {

        Path carpeta = Paths.get(CARPETA);

        if (!Files.exists(carpeta)) {
            return ResponseEntity.ok(List.of());
        }

        try (var stream = Files.list(carpeta)) {
            List<String> nombres = stream
                    .map(p -> p.getFileName().toString())
                    .sorted()
                    .collect(Collectors.toList());
            return ResponseEntity.ok(nombres);
        }
    }

    @GetMapping("/leer/{nombreArchivo}")
    public ResponseEntity<String> leerReporte(@PathVariable String nombreArchivo) throws IOException {

        Path ruta = Paths.get(CARPETA, nombreArchivo);

        if (!Files.exists(ruta)) {
            return ResponseEntity.notFound().build();
        }

        List<String> lineas = Files.readAllLines(ruta, StandardCharsets.UTF_8);
        String contenido = String.join("\n", lineas);
        return ResponseEntity.ok(contenido);
    }
}