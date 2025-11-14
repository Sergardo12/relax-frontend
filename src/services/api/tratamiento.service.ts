import apiClient from '@/lib/api/client';
import { CrearTratamientoDto, TratamientoResponse } from '@/types';

export const tratamientoService = {
  create: async (dto: CrearTratamientoDto): Promise<TratamientoResponse> => {
    const { data } = await apiClient.post('/tratamientos', dto);
    return data;
  },

  getAll: async (): Promise<TratamientoResponse[]> => {
    const { data } = await apiClient.get('/tratamientos');
    return data;
  },
  getTratamientosByPaciente: async (idPaciente: string):Promise<TratamientoResponse[]> => {
    const {data } = await apiClient.get(`tratamientos/paciente/${idPaciente}`)
    return data
  },

  getTratamientoById: async(id: string): Promise<TratamientoResponse> =>{
    const {data} = await apiClient.get(`/tratamientos/${id}`)
    return data
  },

  putTratamiento: async(id: string): Promise<TratamientoResponse> =>{
    const {data} = await apiClient.put(`/tratamientos/${id}`)
    return data
  },

  deleteTratamiento: async(id: string): Promise<void> =>{
    await apiClient.delete(`/tratamientos/${id}`)
  }
  
}; 