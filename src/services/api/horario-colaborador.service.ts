// ==================== HORARIO-COLABORADOR SERVICE ====================

import apiClient from '@/lib/api/client';
import {
  CrearHorarioColaboradorDto,
  ActualizarHorarioColaboradorDto,
  HorarioColaborador,
} from '@/types';

export const horarioColaboradorService = {
  // POST /horarios-colaborador - Crear horario
  create: async (dto: CrearHorarioColaboradorDto): Promise<HorarioColaborador> => {
    const { data } = await apiClient.post('/horarios-colaborador', dto);
    return data;
  },

  // GET /horarios-colaborador/colaborador/:idColaborador - Listar horarios por colaborador
  getByColaborador: async (idColaborador: string): Promise<HorarioColaborador[]> => {
    const { data } = await apiClient.get(`/horarios-colaborador/colaborador/${idColaborador}`);
    return data;
  },

  // GET /horarios-colaborador/:id - Obtener horario por ID
  getById: async (id: string): Promise<HorarioColaborador> => {
    const { data } = await apiClient.get(`/horarios-colaborador/${id}`);
    return data;
  },

  // PUT /horarios-colaborador/:id - Actualizar horario
  update: async (
    id: string,
    dto: ActualizarHorarioColaboradorDto
  ): Promise<HorarioColaborador> => {
    const { data } = await apiClient.put(`/horarios-colaborador/${id}`, dto);
    return data;
  },

  // DELETE /horarios-colaborador/:id - Eliminar horario
  delete: async (id: string): Promise<void> => {
    const { data } = await apiClient.delete(`/horarios-colaborador/${id}`);
    return data;
  },
};
