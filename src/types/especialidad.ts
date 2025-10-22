// ==================== ESPECIALIDAD TYPES ====================

export enum EstadoEspecialidad {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

// DTOs de Request
export interface CrearEspecialidadDto {
  nombre: string;
  descripcion: string;
}

// Responses
export interface EspecialidadResponse {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
}
