package com.inkasalud.catalogoservice.service;
import com.inkasalud.catalogoservice.socket.SocketNotificationServer;
import com.inkasalud.catalogoservice.dto.ProductoDto;
import com.inkasalud.catalogoservice.entity.Categoria;
import com.inkasalud.catalogoservice.entity.Producto;
import com.inkasalud.catalogoservice.repository.CategoriaRepository;
import com.inkasalud.catalogoservice.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SocketNotificationServer socketNotificationServer;

    public ProductoServiceImpl(ProductoRepository productoRepository, CategoriaRepository categoriaRepository, SocketNotificationServer socketNotificationServer)
    {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.socketNotificationServer = socketNotificationServer;
    }
    @Override
    public List<ProductoDto> listar() {
        return productoRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductoDto obtener(Long id) {
        return toDto(productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id)));
    }

    @Override
    public ProductoDto crear(ProductoDto dto) {

        Producto productoGuardado =
                productoRepository.save(toEntity(dto));

        socketNotificationServer.notificar(
                "Nuevo producto registrado: "
                        + productoGuardado.getNombre()
        );

        return toDto(productoGuardado);
    }

    @Override
    public ProductoDto actualizar(Long id, ProductoDto dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
        producto.setNombre(dto.nombre());
        producto.setDescripcion(dto.descripcion());
        producto.setPrecio(dto.precio());
        producto.setStock(dto.stock());
        if (dto.categoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + dto.categoriaId()));
            producto.setCategoria(categoria);
        }
        Producto productoActualizado =
                productoRepository.save(producto);

        socketNotificationServer.notificar(
                "Producto actualizado: "
                        + productoActualizado.getNombre()
        );

        return toDto(productoActualizado);
    }

    @Override
    public void eliminar(Long id) {

        socketNotificationServer.notificar(
                "Producto eliminado con ID: " + id
        );

        productoRepository.deleteById(id);
    }

    private ProductoDto toDto(Producto p) {
        Long categoriaId = p.getCategoria() != null ? p.getCategoria().getId() : null;
        return new ProductoDto(p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecio(), p.getStock(), categoriaId);
    }

    private Producto toEntity(ProductoDto dto) {
        Producto p = new Producto();
        p.setNombre(dto.nombre());
        p.setDescripcion(dto.descripcion());
        p.setPrecio(dto.precio());
        p.setStock(dto.stock());
        if (dto.categoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + dto.categoriaId()));
            p.setCategoria(categoria);
        }
        return p;
    }
}
