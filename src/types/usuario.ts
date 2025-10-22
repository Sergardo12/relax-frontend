import { RolResponse } from './rol';
// ==================== USUARIO TYPES ====================

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

// DTOs de Request
export interface CrearUsuarioDto {
  correo: string;
  contraseña: string;
  rolId: string;
  estado: string;
}

// Responses
export interface UsuarioResponse {
  id: string;
  correo: string;
  rol: RolResponse;
  estado: EstadoUsuario;
}

export interface UsuarioPerfilResponse {
  id: string;
  correo: string;
  rol: string;
  estado: EstadoUsuario;
}
