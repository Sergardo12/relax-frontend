// ==================== PAGO-CITA TYPES ====================

export enum MetodoPagoCita {
  TARJETA = 'tarjeta',
  YAPE = 'yape',
  EFECTIVO = 'efectivo',
}

export enum EstadoPagoCita {
  PENDIENTE = 'pendiente',
  EXITOSO = 'exitoso',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado',
}

// DTOs de Request
export interface PagarConTarjetaDto {
  idCita: string;
  token: string;
  email: string;
}

export interface PagarConYapeDto {
  idCita: string;
  email: string;
}

export interface PagarConEfectivoDto {
  idCita: string;
  email: string;
}

export interface PagarConMembresiaDto {
  idCita: string;
  email: string;
}

// Responses
export interface PagoCitaResponse {
  id: string;
  cita: {
    id: string;
    fecha: Date | string;
    hora: string;
    estado: string;
  };
  culqiChargeId: string | null;
  culqiToken: string | null;
  fechaPago: Date | string;
  metodoPago: MetodoPagoCita;
  montoTotal: number;
  moneda: string;
  estado: EstadoPagoCita;
  culqiResponse: any | null;
  mensajeError: string | null;
  qrUrl: string | null;
  paymentUrl: string | null;
}
