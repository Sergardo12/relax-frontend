// ==================== CITA TYPES ====================


export enum CitaEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado',
}

// DTOs de Request
export interface CrearCitaDto {
  idPaciente: string;
  fecha: string;
  hora: string;
}

export interface ActualizarCitaDto {
  fecha?: string;
  hora?: string;
}

export interface ListarCitasDto {
  idPaciente?: string;
  fecha?: string;
  estado?: CitaEstado;
}

// Responses
export interface CitaResponse {
  id: string;
  paciente: {
    id: string;
    usuario: {
      id: string;
      correo: string;
      rol: {
        id: string;
        nombre: string;
        descripcion: string;
        estado: string;
      };
      estado: string;
      perfilCompleto: boolean;
    };
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    telefono: string;
  };
  fecha: string;
  hora: string;
  estado: CitaEstado;
  estadoPago: EstadoPago;
}
