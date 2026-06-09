package com.inkasalud.ventasservice.repository;

import com.inkasalud.ventasservice.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}
