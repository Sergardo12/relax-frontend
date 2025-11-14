// ==================== PACIENTE SERVICE ====================

import apiClient from "@/lib/api/client";
import {
  CompletarDatosPacienteDto,
  CompletarDatosPacienteResponse,
  PacienteMeResponse,
  PacienteResponse,
} from "@/types";

export const pacienteService = {
  /**
   * POST /pacientes/completar-datos - Completar datos del paciente
   */
  completarDatos: async (
    dto: CompletarDatosPacienteDto
  ): Promise<CompletarDatosPacienteResponse> => {
    const { data } = await apiClient.post<CompletarDatosPacienteResponse>(
      "/pacientes/completar-datos",
      dto
    );
    return data;
  },

  /**
   * GET /pacientes/me - Obtener datos completos del paciente autenticado
   */
  getMe: async (): Promise<PacienteMeResponse> => {
    const { data } = await apiClient.get<PacienteMeResponse>("/pacientes/me");
    return data;
  },

  listarPacientes: async (): Promise<PacienteResponse[]> => {
    try {
      console.log("📡 Haciendo petición a /pacientes...");
      const response = await apiClient.get<PacienteResponse[]>("/pacientes");

      console.log("✅ Response completo:", response); // 🔥 TODO el objeto
      console.log("✅ Response.data:", response.data); // 🔥 Solo data
      console.log("✅ Response.status:", response.status); // 🔥 Status code

      return response.data;
    } catch (error: any) {
      console.error("❌ Error:", error);
      console.error("❌ Error.response:", error.response);
      throw error;
    }
  },
};
