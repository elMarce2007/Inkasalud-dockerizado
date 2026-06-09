package com.inkasalud.ventasservice.service;

import com.inkasalud.ventasservice.dto.DetalleVentaDto;
import com.inkasalud.ventasservice.dto.VentaDto;
import com.inkasalud.ventasservice.entity.DetalleVenta;
import com.inkasalud.ventasservice.entity.Venta;
import com.inkasalud.ventasservice.messaging.StockUpdateSender;
import com.inkasalud.ventasservice.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final StockUpdateSender stockUpdateSender;

    public VentaServiceImpl(VentaRepository ventaRepository, StockUpdateSender stockUpdateSender) {
        this.ventaRepository = ventaRepository;
        this.stockUpdateSender = stockUpdateSender;
    }

    @Override
    public List<VentaDto> listar() {
        return ventaRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public VentaDto obtener(Long id) {
        return toDto(ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada: " + id)));
    }

    @Override
    @Transactional
    public VentaDto crear(VentaDto dto) {
        Venta venta = new Venta();
        venta.setFecha(dto.fecha() != null ? dto.fecha() : LocalDateTime.now());
        venta.setClienteId(dto.clienteId());

        List<DetalleVenta> detalles = dto.detalles().stream().map(d -> {
            DetalleVenta detalle = new DetalleVenta();
            detalle.setProductoId(d.productoId());
            detalle.setCantidad(d.cantidad());
            detalle.setPrecioUnitario(d.precioUnitario());
            detalle.setSubtotal(d.precioUnitario() * d.cantidad());
            return detalle;
        }).collect(Collectors.toList());

        venta.setDetalles(detalles);
        venta.setTotal(detalles.stream().mapToDouble(DetalleVenta::getSubtotal).sum());

        Venta saved = ventaRepository.save(venta);
        detalles.forEach(d -> stockUpdateSender.sendStockUpdate(d.getProductoId(), d.getCantidad()));

        return toDto(saved);
    }

    private VentaDto toDto(Venta v) {
        List<DetalleVentaDto> detallesDto = v.getDetalles().stream()
                .map(d -> new DetalleVentaDto(d.getId(), d.getProductoId(), d.getCantidad(),
                        d.getPrecioUnitario(), d.getSubtotal()))
                .collect(Collectors.toList());
        return new VentaDto(v.getId(), v.getFecha(), v.getClienteId(), v.getTotal(), detallesDto);
    }
}
