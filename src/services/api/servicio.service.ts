// ==================== SERVICIO SERVICE ====================

import apiClient from '@/lib/api/client';
import { CrearServicioDto, ServicioResponse } from '@/types';

export const servicioService = {
  // POST /servicio - Crear servicio
  create: async (dto: CrearServicioDto): Promise<ServicioResponse> => {
    const { data } = await apiClient.post('/servicio', dto);
    return data;
  },
  // GET /servicio/por-especialidad/${idEspecialdiad}
  obtenerServicioPorEspecialidad: async(idEspecialidad: string): Promise<ServicioResponse[]> =>{
    const {data} = await apiClient.get<ServicioResponse[]>(`/servicio/por-especialidad/${idEspecialidad}`)
    return data
  }
}
  
