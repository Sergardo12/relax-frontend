export enum CategoriaProducto {
  BELLEZA = 'belleza',
  AROMATERAPIA = 'aromaterapia',
  MASAJES = 'masajes',
  FACIAL = 'facial',
  CORPORAL = 'corporal',
  OTROS = 'otros'
}

export enum EstadoProducto {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo'
}

export interface ProductoResponse {
  id: string;
  nombre: string;
  descripcion?: string;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  categoria: CategoriaProducto;
  estado: EstadoProducto;
  fechaVencimiento?: string;
  lote?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearProductoDto {
  nombre: string;
  descripcion?: string;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  categoria: CategoriaProducto;
  fechaVencimiento?: string;
  lote?: string;
}
export interface ActualizarProductoDto {
  nombre?: string;
  descripcion?: string;
  precioCosto?: number;
  precioVenta?: number;
  stockMinimo?: number;  
  categoria?: CategoriaProducto;
  estado?: EstadoProducto;
  fechaVencimiento?: string;
  lote?: string;
}

export interface AjustarStockDto {
  cantidad: number;
  motivo: string;
}
