// ==================== ROL SERVICE ====================

import apiClient from '@/lib/api/client';
import { CrearRolDto, RolResponse } from '@/types';

export const rolService = {
  // POST /roles - Crear rol
  create: async (dto: CrearRolDto): Promise<RolResponse> => {
    const { data } = await apiClient.post('/roles', dto);
    return data;
  },
};
