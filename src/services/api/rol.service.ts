// ==================== ROL SERVICE ====================

import apiClient from '@/lib/api/client';
import { CrearRolDto, Rol } from '@/types';

export const rolService = {
  // POST /roles - Crear rol
  create: async (dto: CrearRolDto): Promise<Rol> => {
    const { data } = await apiClient.post('/roles', dto);
    return data;
  },
};
