// ==================== ESPECIALIDAD SERVICE ====================

import apiClient from '@/lib/api/client';
import { CrearEspecialidadDto, EspecialidadResponse } from '@/types';

export const especialidadService = {
  // POST /especialidades - Crear especialidad
  create: async (dto: CrearEspecialidadDto): Promise<EspecialidadResponse> => {
    const { data } = await apiClient.post('/especialidades', dto);
    return data;
  },

  getEspecialidadesActivas: async (): Promise<EspecialidadResponse[]> =>{
    const {data} = await apiClient.get<EspecialidadResponse[]>('/especialidades/activas')
    return data
  },

  getEspecialidadById: async(id: string): Promise<EspecialidadResponse> =>{
    const {data} = await apiClient.get<EspecialidadResponse>(`/especialidades/${id}`)
    return data
  }
};
