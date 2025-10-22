// ==================== ROL TYPES ====================

export enum EstadoRol {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

// DTOs de Request
export interface CrearRolDto {
  nombre: string;
  descripcion: string;
}

// Responses
export interface RolResponse {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoRol;
}
