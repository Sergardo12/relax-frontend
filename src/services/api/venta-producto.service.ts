// services/api/venta-producto.service.ts

import apiClient from '@/lib/api/client';
import { VentaProductoResponse, CrearVentaProductoDto } from '@/types';

export const ventaProductoService = {
  // GET /ventas
  getAll: async (): Promise<VentaProductoResponse[]> => {
    const { data } = await apiClient.get<VentaProductoResponse[]>('/ventas');
    return data;
  },

  // GET /ventas/{id}
  getById: async (id: string): Promise<VentaProductoResponse> => {
    const { data } = await apiClient.get<VentaProductoResponse>(`/ventas/${id}`);
    return data;
  },

  // POST /ventas
  create: async (dto: CrearVentaProductoDto): Promise<VentaProductoResponse> => {
    const { data } = await apiClient.post<VentaProductoResponse>('/ventas', dto);
    return data;
  },
};