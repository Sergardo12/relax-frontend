// ==================== AUTH SERVICE ====================

import apiClient from '@/lib/api/client';
import {
  LoginDto,
  LoginResponse,
  RegisterPacienteDto,
  RegisterColaboradorDto,
  RegisterResponse,
  PerfilUsuarioResponse,
} from '@/types';

export const authService = {
  /**
   * POST /auth/register - Registrar paciente
   */
  register: async (dto: RegisterPacienteDto): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', dto);
    return data;
  },

  /**
   * POST /auth/register/colaborador - Registrar colaborador
   */
  registerColaborador: async (
    dto: RegisterColaboradorDto
  ): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>(
      '/auth/register/colaborador',
      dto
    );
    return data;
  },

  /**
   * POST /auth/login - Login
   */
  login: async (dto: LoginDto): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', dto);
    return data;
  },

  /**
   * GET /usuarios/perfil - Obtener perfil del usuario autenticado
   */
  getPerfil: async (): Promise<PerfilUsuarioResponse> => {
    const { data } = await apiClient.get<PerfilUsuarioResponse>('/usuarios/perfil');
    return data;
  },
};