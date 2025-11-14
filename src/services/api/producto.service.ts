// services/api/producto.service.ts

import apiClient from '@/lib/api/client';
import { ProductoResponse, CrearProductoDto, AjustarStockDto, ActualizarProductoDto } from '@/types';

export const productoService = {
  // GET /productos
  getAll: async (): Promise<ProductoResponse[]> => {
    const { data } = await apiClient.get<ProductoResponse[]>('/productos');
    return data;
  },

  // GET /productos/stock-bajo
  getStockBajo: async (): Promise<ProductoResponse[]> => {
    const { data } = await apiClient.get<ProductoResponse[]>('/productos/stock-bajo');
    return data;
  },

  // GET /productos/{id}
  getById: async (id: string): Promise<ProductoResponse> => {
    const { data } = await apiClient.get<ProductoResponse>(`/productos/${id}`);
    return data;
  },

  // POST /productos
  create: async (dto: CrearProductoDto): Promise<ProductoResponse> => {
    const { data } = await apiClient.post<ProductoResponse>('/productos', dto);
    return data;
  },

  // PUT /productos/{id}
  update: async (id: string, dto: Partial<ActualizarProductoDto>): Promise<ProductoResponse> => {
    const { data } = await apiClient.put<ProductoResponse>(`/productos/${id}`, dto);
    return data;
  },

  // DELETE /productos/{id}
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/productos/${id}`);
  },

  // PATCH /productos/{id}/ajustar-stock
  ajustarStock: async (id: string, dto: AjustarStockDto): Promise<ProductoResponse> => {
    const { data } = await apiClient.patch<ProductoResponse>(`/productos/${id}/ajustar-stock`, dto);
    return data;
  },
};