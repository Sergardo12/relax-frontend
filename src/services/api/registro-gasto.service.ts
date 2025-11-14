// services/api/registro-gasto.service.ts

import apiClient from '@/lib/api/client';
import { RegistroGastoResponse, CrearRegistroGastoDto, CategoriaGasto } from '@/types';

export const registroGastoService = {
  // GET /gastos
  getAll: async (): Promise<RegistroGastoResponse[]> => {
    const { data } = await apiClient.get<RegistroGastoResponse[]>('/gastos');
    return data;
  },

  // GET /gastos/categoria/{categoria}
  getByCategoria: async (categoria: CategoriaGasto): Promise<RegistroGastoResponse[]> => {
    const { data } = await apiClient.get<RegistroGastoResponse[]>(`/gastos/categoria/${categoria}`);
    return data;
  },

  // GET /gastos/{id}
  getById: async (id: string): Promise<RegistroGastoResponse> => {
    const { data } = await apiClient.get<RegistroGastoResponse>(`/gastos/${id}`);
    return data;
  },

  // POST /gastos
  create: async (dto: CrearRegistroGastoDto): Promise<RegistroGastoResponse> => {
    const { data } = await apiClient.post<RegistroGastoResponse>('/gastos', dto);
    return data;
  },
};