// services/api/proveedor-insumo.service.ts

import apiClient from '@/lib/api/client';
import { ProveedorInsumoResponse, CrearProveedorInsumoDto } from '@/types';

export const proveedorInsumoService = {
  // GET /proveedores-insumo
  getAll: async (): Promise<ProveedorInsumoResponse[]> => {
    const { data } = await apiClient.get<ProveedorInsumoResponse[]>('/proveedores-insumo');
    return data;
  },

  // GET /proveedores-insumo/{id}
  getById: async (id: string): Promise<ProveedorInsumoResponse> => {
    const { data } = await apiClient.get<ProveedorInsumoResponse>(`/proveedores-insumo/${id}`);
    return data;
  },

  // POST /proveedores-insumo
  create: async (dto: CrearProveedorInsumoDto): Promise<ProveedorInsumoResponse> => {
    const { data } = await apiClient.post<ProveedorInsumoResponse>('/proveedores-insumo', dto);
    return data;
  },

  // PUT /proveedores-insumo/{id}
  update: async (id: string, dto: Partial<CrearProveedorInsumoDto>): Promise<ProveedorInsumoResponse> => {
    const { data } = await apiClient.put<ProveedorInsumoResponse>(`/proveedores-insumo/${id}`, dto);
    return data;
  },

  // DELETE /proveedores-insumo/{id}
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/proveedores-insumo/${id}`);
  },
};