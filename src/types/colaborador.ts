// ==================== COLABORADOR TYPES ====================

import { UsuarioResponse } from './usuario';
import { EspecialidadResponse } from './especialidad';
import { RolResponse } from './rol';

// DTOs de Request
export interface CrearColaboradorDto {
  idUsuario: string;
  idEspecialidad: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  fechaContratacion: string;
  telefono: string;
}

export interface ActualizarColaboradorDto {
  idEspecialidad?: string;
  nombres?: string;
  apellidos?: string;
  dni?: string;
  fechaNacimiento?: string;
  fechaContratacion?: string;
  telefono?: string;
}

export interface ListarColaboradoresDto {
  idEspecialidad?: string;
}

export interface CompletarDatosColaboradorDto {
  idUsuario: string;
  idEspecialidad: {
    id: string;
    nombre: string
  };
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  fechaContratacion: string;
  telefono: string;
}

// Responses

export interface ColaboradorMeResponse {
  id: string;
  usuarioId: string;
  nombre: string;
  apellido: string;
  dni?: string;
  telefono?: string;
  especialidadId?: string;
  especialidad?: {
    id: string;
    nombre: string;
  };

}
export interface CompletarDatosColaboradorResponse {
  mensaje: string;
  colaborador?: ColaboradorMeResponse;
}

export interface ColaboradorResponse {
  id: string;
  usuario: UsuarioResponse & { perfilCompleto: boolean };
  especialidad: EspecialidadResponse;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  fechaContratacion: string;
  telefono: string;
}
