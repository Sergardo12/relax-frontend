import apiClient from "@/lib/api/client";
import { PagarSuscripcionTarjetaDto } from "@/types";

export const pagoSuscripcionService ={
    // POST /pagos-suscripcion/tarjeta - Pagar con tarjeta (Culqi)
    pagarConTarjeta: async (dto: PagarSuscripcionTarjetaDto): Promise<any> => {
    const { data } = await apiClient.post('/pagos-suscripcion/tarjeta', dto);
    return data;
  }

}