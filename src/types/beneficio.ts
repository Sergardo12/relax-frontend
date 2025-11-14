

export interface BeneficioMembresiaResponse {
  id: string;
  membresia: {
    id: string;
    nombre: string;
  };
  servicio: {
    id: string;
    nombre: string;
    precio: string;
  };
  cantidad: number;
}

export interface ConsumoBeneficioResponse {
  id: string;
  suscripcion: {
    id: string;
  };
  servicio: {
    id: string;
    nombre: string;
  };
  cantidadTotal: number;
  cantidadConsumida: number;
  cantidadDisponible: number;
}