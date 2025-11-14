
import { ProductoResponse } from './producto';
import { ProveedorResponse } from './proveedor';

export enum TipoComprobanteCompra {
  FACTURA = 'factura',
  BOLETA = 'boleta',
  GUIA = 'guia'
}

export enum EstadoCompra {
  REGISTRADA = 'registrada',
  ANULADA = 'anulada'
}

export interface DetalleCompraResponse {
  id: string;
  producto: ProductoResponse;
  cantidad: number;
  precioCompra: number;
  subtotal: number;
}

export interface CompraProductoResponse {
  id: string;
  proveedor: ProveedorResponse;
  fecha: string;
  tipoComprobante: TipoComprobanteCompra;
  numeroComprobante: string;
  total: number;
  estado: EstadoCompra;
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
  detalles?: DetalleCompraResponse[];
}

export interface DetalleCompraDto {
  idProducto: string;
  cantidad: number;
  precioCompra: number;
}

export interface CrearCompraProductoDto {
  idProveedor: string;
  fecha: string;
  tipoComprobante: TipoComprobanteCompra;
  numeroComprobante: string;
  observaciones?: string;
  detalles: DetalleCompraDto[];
}