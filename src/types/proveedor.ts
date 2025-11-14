// types/proveedor.ts

export enum EstadoProveedor {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo'
}

export interface ProveedorResponse {
  id: string;
  nombre: string;
  ruc: string;
  telefono: string;
  email?: string;
  direccion?: string;
  estado: EstadoProveedor;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearProveedorDto {
  nombre: string;
  ruc: string;
  telefono: string;
  email?: string;
  direccion?: string;
}

export interface ActualizarProveedorDto {
    nombre?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    estado?: EstadoProveedor
}