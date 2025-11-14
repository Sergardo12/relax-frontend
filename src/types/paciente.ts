// ==================== PACIENTE TYPES ====================

import { UsuarioResponse } from "./usuario";

// DTO para completar datos del paciente
export interface CompletarDatosPacienteDto {
  usuarioId: string;
  nombres: string;
  apellidos: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string;

}

// Response de GET /pacientes/me
export interface PacienteMeResponse {
  id: string;
  usuarioId: string;
  nombres: string;
  apellidos: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string;

}

// Response de POST /pacientes/completar-datos
export interface CompletarDatosPacienteResponse {
  mensaje: string;
  paciente?: PacienteMeResponse;
}

export interface PacienteResponse {
  id: string;
  usuario: UsuarioResponse & {perfilCompleto: boolean};
  nombres: string;
  apellidos: string;
  dni?: string
  fechaNacimiento: string;
  telefono?: string
}