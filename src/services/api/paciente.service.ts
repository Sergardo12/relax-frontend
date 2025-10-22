// ==================== PACIENTE SERVICE ====================

import apiClient from '@/lib/api/client';
import {
  CompletarDatosPacienteDto,
  CompletarDatosPacienteResponse,
  PacienteMeResponse,
} from '@/types';

export const pacienteService = {
  /**
   * POST /pacientes/completar-datos - Completar datos del paciente
   */
  completarDatos: async (
    dto: CompletarDatosPacienteDto
  ): Promise<CompletarDatosPacienteResponse> => {
    const { data } = await apiClient.post<CompletarDatosPacienteResponse>(
      '/pacientes/completar-datos',
      dto
    );
    return data;
  },

  /**
   * GET /pacientes/me - Obtener datos completos del paciente autenticado
   */
  getMe: async (): Promise<PacienteMeResponse> => {
    const { data } = await apiClient.get<PacienteMeResponse>('/pacientes/me');
    return data;
  },

  // ... otros métodos que ya tenías
};