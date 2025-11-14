import { CitaResponse } from "./cita";
import { ColaboradorResponse } from "./colaborador";
import { PacienteMeResponse, PacienteResponse } from "./paciente";


export enum EstadoTratamiento{
    ACTIVO = 'ACTIVO',
    FINALIZADO = 'FINALIZADO',
    CANCELADO = 'CANCELADO',
    INACTIVO = 'INACTIVO',
    COMPLETADO = 'COMPLETADO'
}

export interface CrearTratamientoDto {
  idCita?: string;
  idPaciente: string;
  idColaborador: string;
  fechaInicio: string;
  diagnostico: string;
  tratamiento: string;
  presionArterial?: string;
  pulso?: number;
  temperatura?: number;
  peso?: number;
  saturacion?: number;
  sesionesTotales: number;
  precioTotal: number;
}

export interface TratamientoResponse {
  id: string;
  cita?: CitaResponse | null;
  colaborador: ColaboradorResponse;
  paciente: PacienteResponse;
  fechaInicio: string;
  diagnostico: string;
  tratamiento: string;
  presionArterial?: string;
  pulso?: number;
  temperatura?: number;
  peso?: number;
  saturacion?: number;
  sesionesTotales: number;
  sesionesRealizadas: number;  
  fechaFin?: string
  precioTotal: number;
  estado: EstadoTratamiento; 
  

}