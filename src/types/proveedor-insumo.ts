// types/proveedor-insumo.ts

export enum EstadoProveedorInsumo {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo'
}

export interface ProveedorInsumoResponse {
  id: string;
  nombre: string;
  ruc: string;
  telefono: string;
  email?: string;
  direccion?: string;
  estado: EstadoProveedorInsumo;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearProveedorInsumoDto {
  nombre: string;
  ruc: string;
  telefono: string;
  email?: string;
  direccion?: string;
}