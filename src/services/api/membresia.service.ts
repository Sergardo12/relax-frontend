import apiClient from "@/lib/api/client";
import { MembresiaResponse } from "@/types";

export const membresiaService = {
    // GET /membresias/activas/ - Listar membresias activas
    getActivas: async(): Promise<MembresiaResponse[]> =>{
        const {data} = await apiClient.get<MembresiaResponse[]>('/membresias/activas')
        return data
    },

    // GET /membresias/{id} - Obtener detalle de membresía
    getById: async(id: string): Promise<MembresiaResponse> =>{
        const {data} = await apiClient.get<MembresiaResponse>(`/membresias/${id}`)
        return data
    }
}