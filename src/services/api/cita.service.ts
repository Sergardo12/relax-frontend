// ==================== CITA SERVICE ====================

import apiClient from '@/lib/api/client';
import { CrearCitaDto, ActualizarCitaDto, ListarCitasDto, CitaResponse } from '@/types';

export const citaService = {
  // POST /citas - Crear cita
  create: async (dto: CrearCitaDto): Promise<CitaResponse> => {
    const { data } = await apiClient.post<CitaResponse>('/citas', dto);
    return data;
  },

  // GET /citas - Listar citas con filtros opcionales
  getAll: async (params?: ListarCitasDto): Promise<CitaResponse[]> => {
    const { data } = await apiClient.get<CitaResponse[]>('/citas', { params });
    return data;
  },

  // GET /citas/:id - Obtener cita por IDhaber vayamos por partes
  getById: async (id: string): Promise<CitaResponse> => {
    const { data } = await apiClient.get(`/citas/${id}`);
    return data;
  },
  // GET /citas/mis-citas - obtener solo mis citas

  getMisCitas: async (): Promise<CitaResponse[]> => {
    const {data}= await apiClient.get<CitaResponse[]>('/citas/mis-citas')
    return data
  },

  // PUT /citas/:id - Actualizar cita
  update: async (id: string, dto: ActualizarCitaDto): Promise<CitaResponse> => {
    const { data } = await apiClient.put(`/citas/${id}`, dto);
    return data;
  },

  // PATCH /citas/:id/cancelar - Cancelar cita
  cancel: async (id: string): Promise<CitaResponse> => {
    const { data } = await apiClient.patch(`/citas/${id}/cancelar`);
    return data;
  },
};
