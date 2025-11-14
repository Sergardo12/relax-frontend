import apiClient from "@/lib/api/client";
import {CrearSuscripcionDto, PagarSuscripcionTarjetaDto, SuscripcionResponse } from "@/types";

export const suscripcionService = {
    // POST /suscripciones / crear suscripcion
    create: async(dto: CrearSuscripcionDto): Promise<SuscripcionResponse> => {
        const {data} = await apiClient.post<SuscripcionResponse>('/suscripciones', dto)
        return data
    },

    // GET /suscripciones/paciente/{idPaciente} - Obtener suscripciones del paciente
    getByPaciente: async(idPaciente: string): Promise<SuscripcionResponse[]> =>{
        const {data} = await apiClient.get<SuscripcionResponse[]>(`/suscripciones/paciente/${idPaciente}`)
        return data
    }
    
}