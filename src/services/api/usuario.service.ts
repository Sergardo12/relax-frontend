// ==================== USUARIO SERVICE ====================

import apiClient from '@/lib/api/client';
import { CrearUsuarioDto, Usuario, UsuarioPerfilResponse } from '@/types';

export const usuarioService = {
  // POST /usuarios - Crear usuario genérico
  create: async (dto: CrearUsuarioDto): Promise<Usuario> => {
    const { data } = await apiClient.post('/usuarios', dto);
    return data;
  },

  // GET /usuarios - Listar todos los usuarios (requiere rol admin)
  getAll: async (): Promise<Usuario[]> => {
    const { data } = await apiClient.get('/usuarios');
    return data;
  },

  // GET /usuarios/perfil - Obtener perfil del usuario autenticado
  getPerfil: async (): Promise<UsuarioPerfilResponse> => {
    const { data } = await apiClient.get('/usuarios/perfil');
    return data;
  },
};
