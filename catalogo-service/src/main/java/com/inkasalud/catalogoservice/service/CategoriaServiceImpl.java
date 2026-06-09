package com.inkasalud.catalogoservice.service;

import com.inkasalud.catalogoservice.dto.CategoriaDto;
import com.inkasalud.catalogoservice.entity.Categoria;
import com.inkasalud.catalogoservice.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public List<CategoriaDto> listar() {
        return categoriaRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoriaDto obtener(Long id) {
        return toDto(categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id)));
    }

    @Override
    public CategoriaDto crear(CategoriaDto dto) {
        return toDto(categoriaRepository.save(toEntity(dto)));
    }

    @Override
    public CategoriaDto actualizar(Long id, CategoriaDto dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
        categoria.setNombre(dto.nombre());
        categoria.setDescripcion(dto.descripcion());
        return toDto(categoriaRepository.save(categoria));
    }

    @Override
    public void eliminar(Long id) {
        categoriaRepository.deleteById(id);
    }

    private CategoriaDto toDto(Categoria c) {
        return new CategoriaDto(c.getId(), c.getNombre(), c.getDescripcion());
    }

    private Categoria toEntity(CategoriaDto dto) {
        Categoria c = new Categoria();
        c.setNombre(dto.nombre());
        c.setDescripcion(dto.descripcion());
        return c;
    }
}
