// ==================== PACIENTE TYPES ====================

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