// services/api/proveedor.service.ts

import apiClient from '@/lib/api/client';
import { ProveedorResponse, CrearProveedorDto, ActualizarProveedorDto } from '@/types';

export const proveedorService = {
  // GET /proveedores
  getAll: async (): Promise<ProveedorResponse[]> => {
    const { data } = await apiClient.get<ProveedorResponse[]>('/proveedores');
    return data;
  },

  // GET /proveedores/activos
  getActivos: async (): Promise<ProveedorResponse[]> => {
    const { data } = await apiClient.get<ProveedorResponse[]>('/proveedores/activos');
    return data;
  },

  // GET /proveedores/{id}
  getById: async (id: string): Promise<ProveedorResponse> => {
    const { data } = await apiClient.get<ProveedorResponse>(`/proveedores/${id}`);
    return data;
  },

  // POST /proveedores
  create: async (dto: CrearProveedorDto): Promise<ProveedorResponse> => {
    const { data } = await apiClient.post<ProveedorResponse>('/proveedores', dto);
    return data;
  },

  // PUT /proveedores/{id}
  update: async (id: string, dto: Partial<ActualizarProveedorDto>): Promise<ProveedorResponse> => {
    const { data } = await apiClient.put<ProveedorResponse>(`/proveedores/${id}`, dto);
    return data;
  },

  // DELETE /proveedores/{id}
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/proveedores/${id}`);
  },
};