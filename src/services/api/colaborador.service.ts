// ==================== COLABORADOR SERVICE ====================

import apiClient from "@/lib/api/client";
import { ColaboradorResponse } from "@/types";
import {
  CompletarDatosColaboradorDto,
  CompletarDatosColaboradorResponse,
  ColaboradorMeResponse,
} from "@/types";

export const colaboradorService = {
  //POST /colaboradores - Completar datos del colaborador
  completarDatos: async (
    dto: CompletarDatosColaboradorDto
  ): Promise<CompletarDatosColaboradorResponse> => {
    const { data } = await apiClient.post<CompletarDatosColaboradorResponse>(
      "/colaboradores",
      dto
    );
    return data;
  },

  // GET /colaboradores/me - Obtener datos completos del colaborador autenticado

  getMe: async (): Promise<ColaboradorMeResponse> => {
    const { data } = await apiClient.get<ColaboradorMeResponse>(
      "/colaboradores/me"
    );
    return data;
  },

  listarColaboradores: async (): Promise<ColaboradorResponse[]> => {
    const { data } = await apiClient.get<ColaboradorResponse[]>(
      "/colaboradores"
    );
    return data;
  },
};
