// ==================== SESIÓN TRATAMIENTO TYPES ====================

import { TratamientoResponse } from "./tratamiento";

export enum EstadoSesion {
  PENDIENTE = 'pendiente',
  REALIZADA = 'realizada',
  CANCELADA = 'cancelada',
}

export interface CrearSesionTratamientoDto {
  idTratamiento: string;
  fecha: string;        // "YYYY-MM-DD"
  hora: string;         // "HH:mm" (ej: "09:00")
  observaciones?: string;
}
export interface CompletarSesionTratamientoDto{
    observaciones?: string
}

export interface SesionTratamientoResponse {
  id: string;
  tratamiento: {id: string};
  fecha: string;
  hora: string;      
  observaciones?: string;
  estado: EstadoSesion
}

export interface ActualizarSesionTratamientoDto {
  fecha?: string;
  hora?: string;
  observaciones?: string;
}