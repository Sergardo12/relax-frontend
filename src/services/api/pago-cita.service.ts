// ==================== PAGO-CITA SERVICE ====================

import apiClient from '@/lib/api/client';
import {
  PagarConTarjetaDto,
  PagarConYapeDto,
  PagarConEfectivoDto,
  PagoCitaResponse,
} from '@/types';

export const pagoCitaService = {
  // POST /pagos-cita/tarjeta - Pagar con tarjeta
  pagarConTarjeta: async (dto: PagarConTarjetaDto): Promise<PagoCitaResponse> => {
    const { data } = await apiClient.post('/pagos-cita/tarjeta', dto);
    return data;
  },

  // POST /pagos-cita/yape - Pagar con Yape
  pagarConYape: async (dto: PagarConYapeDto): Promise<PagoCitaResponse> => {
    const { data } = await apiClient.post('/pagos-cita/yape', dto);
    return data;
  },

  // POST /pagos-cita/efectivo - Pagar con efectivo
  pagarConEfectivo: async (dto: PagarConEfectivoDto): Promise<PagoCitaResponse> => {
    const { data } = await apiClient.post('/pagos-cita/efectivo', dto);
    return data;
  },

  // GET /pagos-cita/cita/:idCita - Obtener pagos por cita
  getByCita: async (idCita: string): Promise<PagoCitaResponse[]> => {
    const { data } = await apiClient.get(`/pagos-cita/cita/${idCita}`);
    return data;
  },

  // GET /pagos-cita/:id - Obtener pago por ID
  getById: async (id: string): Promise<PagoCitaResponse> => {
    const { data } = await apiClient.get(`/pagos-cita/${id}`);
    return data;
  },
};
