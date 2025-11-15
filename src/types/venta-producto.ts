// types/venta-producto.ts

import { ProductoResponse } from './producto';

export enum TipoComprobanteVenta {
  BOLETA = 'boleta',
  FACTURA = 'factura',
  TICKET = 'ticket'
}

export enum MetodoPagoVenta {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
  YAPE = 'yape',
  PLIN = 'plin'
}

export enum EstadoVenta {
  COMPLETADA = 'completada',
  ANULADA = 'anulada'
}

// 🔥 Para ENVIAR al crear venta
export interface DetalleVentaDto {
  idProducto: string;
  cantidad: number;
}

// 🔥 Para RECIBIR del backend (incluye producto completo)
export interface DetalleVentaResponse {
  id: string;
  producto: ProductoResponse;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaProductoResponse {
  id: string;
  fecha: string;
  tipoComprobante: TipoComprobanteVenta;
  metodoPago: MetodoPagoVenta;
  subtotal: number;
  descuento: number;
  igv: number;
  total: number;
  estado: EstadoVenta;
  clienteNombre?: string;
  clienteDocumento?: string;
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
  detalles?: DetalleVentaResponse[];  // 🔥 Usar DetalleVentaResponse
}

export interface CrearVentaProductoDto {
  fecha: string;
  tipoComprobante: TipoComprobanteVenta;
  metodoPago: MetodoPagoVenta;
  descuento?: number;
  clienteNombre?: string;
  clienteDocumento?: string;
  observaciones?: string;
  detalles: DetalleVentaDto[];  // 🔥 Usar DetalleVentaDto para crear
}