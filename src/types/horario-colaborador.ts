import { ColaboradorMeResponse } from './colaborador';
import { EspecialidadResponse } from './especialidad';
// ==================== HORARIO-COLABORADOR TYPES ====================

export enum DiaSemana {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
  DOMINGO = 'domingo',
}

export enum EstadoHorarioColaborador {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

// DTOs de Request
export interface CrearHorarioColaboradorDto {
  idColaborador: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface ActualizarHorarioColaboradorDto {
  idColaborador?: string;
  diaSemana?: DiaSemana;
  horaInicio?: string;
  horaFin?: string;
  estado?: EstadoHorarioColaborador;
}

// Responses
export interface HorarioColaboradorResponse {
   id: string;

  colaborador: {
    id: string;
    nombres: string;
    apellidos: string;
    especialidad: EspecialidadResponse;
  };
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  estado: string;
}
