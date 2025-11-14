// ==================== SESIÓN TRATAMIENTO SERVICE ====================

import apiClient from '@/lib/api/client';
import { CompletarSesionTratamientoDto, CrearSesionTratamientoDto, SesionTratamientoResponse } from '@/types';

export const sesionTratamientoService = {
  /**
   * POST /sesiones-tratamiento - Crear una sesión
   */
  create: async (dto: CrearSesionTratamientoDto): Promise<SesionTratamientoResponse> => {
    const { data } = await apiClient.post<SesionTratamientoResponse>('/sesiones-tratamiento', dto);
    return data;
  },

  /**
   * GET /sesiones-tratamiento/tratamiento/:idTratamiento
   * Obtener todas las sesiones de un tratamiento
   */
  getByTratamiento: async (idTratamiento: string): Promise<SesionTratamientoResponse[]> => {
    const { data } = await apiClient.get<SesionTratamientoResponse[]>(
      `/sesiones-tratamiento/tratamiento/${idTratamiento}`
    );
    return data;
  },

  /**
   * GET /sesiones-tratamiento/:id - Obtener una sesión por ID
   */
  getById: async (id: string): Promise<SesionTratamientoResponse> => {
    const { data } = await apiClient.get<SesionTratamientoResponse>(`/sesiones-tratamiento/${id}`);
    return data;
  },

  /**
   * PATCH /sesiones-tratamiento/:id - Actualizar sesión (ej: marcar como realizada)
   */
  update: async (id: string, dto: Partial<CompletarSesionTratamientoDto>): Promise<SesionTratamientoResponse> => {
    const { data } = await apiClient.patch<SesionTratamientoResponse>(`/sesiones-tratamiento/${id}/completar`, dto);
    return data;
  },

  /**
   * DELETE /sesiones-tratamiento/:id - Eliminar sesión
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sesiones-tratamiento/${id}`);
  },
};