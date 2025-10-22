// ==================== AUTH TYPES ====================

// ==================== DTOs de Request ====================
export interface LoginDto {
  correo: string;
  contraseña: string;
}

export interface RegisterPacienteDto {
  correo: string;
  contraseña: string;
}

export interface RegisterColaboradorDto {
  correo: string;
  contraseña: string;
}

// ==================== Responses del Backend ====================
export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  mensaje: string;
}

export interface PerfilUsuarioResponse {
  id: string;
  correo: string;
  rol: {
    id: string;
    nombre: string; // "paciente" | "colaborador" | "admin"
  };
  perfilCompleto: boolean;
}

// ==================== JWT Payload ====================
export interface JWTPayload {
  sub: string;        // ID del usuario
  correo: string;
  rol: string;        // "paciente" | "colaborador" | "admin"
  iat?: number;
  exp?: number;
}

// ==================== Usuario en Store ====================
export interface UsuarioAuth {
  id: string;
  correo: string;
  rol: string;
  perfil_completo: boolean;
}