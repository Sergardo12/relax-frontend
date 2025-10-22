// ==================== SERVICIO TYPES ====================

import { EspecialidadResponse } from './especialidad';

export enum EstadoServicio {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

// DTOs de Request
export interface CrearServicioDto {
  especialidadId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
}

// Responses
export interface ServicioResponse {
  id: string;
  especialidad: EspecialidadResponse;
  nombre: string;
  descripcion: string;
  precio: string | number;
  duracion: number;
  estado: EstadoServicio;
}
