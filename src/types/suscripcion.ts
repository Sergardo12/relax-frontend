
export enum EstadoSuscripcion {
    PENDIENTE_PAGO = 'pendiente_pago',
    ACTIVA = 'activa',
    VENCIDA = 'vencida',
    CANCELADA = 'cancelada'
}

export interface CrearSuscripcionDto {
  idPaciente: string;
  idMembresia: string;
}

export interface SuscripcionResponse {
  id: string;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
  };
  membresia: {
    id: string;
    nombre: string;
    precio: string;
  };
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoSuscripcion;
}