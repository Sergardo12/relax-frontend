// ==================== DETALLE-CITA TYPES ====================

import { CitaResponse } from './cita';
import { ServicioResponse } from './servicio';
import { ColaboradorResponse } from './colaborador';

// DTOs de Request
export interface CrearDetalleCitaDto {
  idCita: string;
  idServicio: string;
  idColaborador: string;
  cantidad?: number;
  pagarConMembresia?: boolean;

}

export interface ActualizarObservacionesDto {
  observaciones?: string;
  diagnostico?: string;
  recomendaciones?: string;
}

// Responses
export interface DetalleCitaResponse {
  id: string;
  cita: CitaResponse;
  servicio: ServicioResponse;
  colaborador: ColaboradorResponse;
  precioUnitario: string;
  cantidad: number;
  subtotal: string;
  esConMembresia: boolean;
  observaciones?: string;
  diagnostico?: string;
  recomendaciones?: string;
  pagarConMembresia?: boolean;
  fechaRegistro?: Date | string;
}
