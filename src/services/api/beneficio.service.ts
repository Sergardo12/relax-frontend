import apiClient from '@/lib/api/client';
import { BeneficioMembresiaResponse, ConsumoBeneficioResponse } from '@/types';

export const beneficioMembresiaService = {
 
   // GET /beneficios-membresia/membresia/{idMembresia}
  
  getByMembresia: async (idMembresia: string): Promise<BeneficioMembresiaResponse[]> => {
    const { data } = await apiClient.get<BeneficioMembresiaResponse[]>(
      `/beneficios-membresia/membresia/${idMembresia}`
    );
    return data;
  },
};

export const consumoBeneficioService = {

 // GET /consumos-beneficio/suscripcion/{idSuscripcion}

  getBySuscripcion: async (idSuscripcion: string): Promise<ConsumoBeneficioResponse[]> => {
    const { data } = await apiClient.get<ConsumoBeneficioResponse[]>(
      `/consumos-beneficio/suscripcion/${idSuscripcion}`
    );
    return data;
  },
};