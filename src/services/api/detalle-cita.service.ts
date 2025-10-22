// ==================== DETALLE-CITA SERVICE ====================

import apiClient from '@/lib/api/client';
import {
  CrearDetalleCitaDto,
  ActualizarObservacionesDto,
  DetalleCitaResponse,
} from '@/types';

export const detalleCitaService = {
  // POST /detalle-cita - Crear detalle de cita
  create: async (dto: CrearDetalleCitaDto): Promise<DetalleCitaResponse> => {
    const { data } = await apiClient.post('/detalle-cita', dto);
    return data;
  },

  // GET /detalle-cita/cita/:idCita - Listar detalles por cita
  getByCita: async (idCita: string): Promise<DetalleCitaResponse[]> => {
    const { data } = await apiClient.get(`/detalle-cita/cita/${idCita}`);
    return data;
  },

  // GET /detalle-cita/:id - Obtener detalle por ID
  getById: async (id: string): Promise<DetalleCitaResponse> => {
    const { data } = await apiClient.get(`/detalle-cita/${id}`);
    return data;
  },

  // PUT /detalle-cita/:id/observaciones - Actualizar observaciones
  updateObservaciones: async (
    id: string,
    dto: ActualizarObservacionesDto
  ): Promise<DetalleCitaResponse> => {
    const { data } = await apiClient.put(`/detalle-cita/${id}/observaciones`, dto);
    return data;
  },

  // DELETE /detalle-cita/:id - Eliminar detalle de cita
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/detalle-cita/${id}`);
    return data;
  },
};
