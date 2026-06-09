export interface DetalleVenta {
  id?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  productoNombre?: string;
}

export interface Venta {
  id?: number;
  fecha: Date | string;
  clienteId: number;
  total: number;
  detalles: DetalleVenta[];
  clienteNombre?: string;
}

export interface VentaCreate {
  clienteId: number;
  detalles: {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}
