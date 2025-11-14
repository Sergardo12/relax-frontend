import { EstadoSuscripcion } from "./suscripcion";

export enum MetodoPagoSuscripcion {
  TARJETA = 'tarjeta',
  EFECTIVO = 'efectivo',
  YAPE = 'yape',
}

export enum EstadoPagoSuscripcion {
  PENDIENTE = 'pendiente',
  EXITOSO = 'exitoso',
  FALLIDO = 'fallido',
}

export interface PagarSuscripcionTarjetaDto {
  idSuscripcion: string;
  email: string;
  token: string;
}

export interface PagoSuscripcionResponse {
  id: string;
  suscripcion: {
    id: string;
    fechaInicio: Date | string;
    fechaFin: string;
    estado: EstadoSuscripcion;
  };
  culqiChargeId: string | null;
  culqiToken: string | null;
  fechaPago: Date | string;
  metodoPago: MetodoPagoSuscripcion;
  montoTotal: number;
  moneda: string;
  estado: EstadoPagoSuscripcion;
  culqiResponse: any | null;
  mensajeError: string | null;
  qrUrl: string | null;
  paymentUrl: string | null;
}
