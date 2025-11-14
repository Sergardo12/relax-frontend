export enum EstadoMembresia {
    ACTIVA = 'activa',
    INACTIVA = 'inactiva'
}

export interface CrearMembresiaDto{
    id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    duracionDias: number;
    estado: string

}
export interface MembresiaResponse {
    id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    duracionDias: number;
    estado: EstadoMembresia
}