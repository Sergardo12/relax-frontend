// types/registro-gasto.ts

import { ProveedorResponse } from './proveedor';

export enum CategoriaGasto {
  PRODUCTOS_LIMPIEZA = 'productos_limpieza',
  INSUMOS_MASAJE = 'insumos_masaje',
  SERVICIOS_BASICOS = 'servicios_basicos',
  MANTENIMIENTO = 'mantenimiento',
  OTROS = 'otros'
}

export enum TipoComprobanteGasto {
  FACTURA = 'factura',
  BOLETA = 'boleta',
  RECIBO = 'recibo'
}

export enum EstadoGasto {
  REGISTRADO = 'registrado',
  ANULADO = 'anulado'
}

// Para ENVIAR al crear
export interface DetalleGastoDto {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

// Para RECIBIR del backend
export interface DetalleGastoResponse {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface RegistroGastoResponse {
  id: string;
  proveedor: ProveedorResponse;
  fecha: string;
  categoria: CategoriaGasto;
  tipoComprobante: TipoComprobanteGasto;
  numeroComprobante: string;
  total: number;
  estado: EstadoGasto;
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
  detalles?: DetalleGastoResponse[];
}

export interface CrearRegistroGastoDto {
  idProveedor: string;
  fecha: string;
  categoria: CategoriaGasto;
  tipoComprobante: TipoComprobanteGasto;
  numeroComprobante: string;
  observaciones?: string;
  detalles: DetalleGastoDto[];
}