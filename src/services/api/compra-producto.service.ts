// services/api/compra-producto.service.ts

import apiClient from '@/lib/api/client';
import { CompraProductoResponse, CrearCompraProductoDto } from '@/types';

export const compraProductoService = {
  // GET /compras
  getAll: async (): Promise<CompraProductoResponse[]> => {
    const { data } = await apiClient.get<CompraProductoResponse[]>('/compras');
    return data;
  },

  // GET /compras/{id}
  getById: async (id: string): Promise<CompraProductoResponse> => {
    const { data } = await apiClient.get<CompraProductoResponse>(`/compras/${id}`);
    return data;
  },

  // POST /compras
  create: async (dto: CrearCompraProductoDto): Promise<CompraProductoResponse> => {
    const { data } = await apiClient.post<CompraProductoResponse>('/compras', dto);
    return data;
  },
};