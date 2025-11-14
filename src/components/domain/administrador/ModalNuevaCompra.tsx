// components/domain/administrador/ModalNuevaCompra.tsx

"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, Loader2, Plus, Trash2, Search } from "lucide-react";
import { compraProductoService, proveedorService, productoService } from "@/services/api";
import { ProveedorResponse, ProductoResponse, CrearCompraProductoDto, TipoComprobanteCompra } from "@/types";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface DetalleItem {
  idProducto: string;
  producto: ProductoResponse;
  cantidad: number;
  precioCompra: string;
}

export default function ModalNuevaCompra({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Datos
  const [proveedores, setProveedores] = useState<ProveedorResponse[]>([]);
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  
  // Form
  const [idProveedor, setIdProveedor] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobanteCompra>(TipoComprobanteCompra.FACTURA);
  const [numeroComprobante, setNumeroComprobante] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  // Detalles
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState<ProductoResponse[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (busquedaProducto) {
      const filtrados = productos.filter(p => 
        !detalles.some(d => d.idProducto === p.id) &&
        (p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
         p.categoria.toLowerCase().includes(busquedaProducto.toLowerCase()))
      );
      setProductosFiltrados(filtrados);
    } else {
      setProductosFiltrados([]);
    }
  }, [busquedaProducto, productos, detalles]);

  async function cargarDatos() {
    try {
      const [proveedoresData, productosData] = await Promise.all([
        proveedorService.getActivos(),
        productoService.getAll()
      ]);
      setProveedores(proveedoresData);
      setProductos(productosData.filter(p => p.estado === 'activo'));
    } catch (err) {
      toast.error("Error al cargar datos");
    } finally {
      setLoadingData(false);
    }
  }

  function agregarProducto(producto: ProductoResponse) {
    setDetalles([...detalles, {
      idProducto: producto.id,
      producto,
      cantidad: 1,
      precioCompra: producto.precioCosto.toString()
    }]);
    setBusquedaProducto('');
  }

  function actualizarDetalle(index: number, campo: 'cantidad' | 'precioCompra', valor: string) {
    const nuevosDetalles = [...detalles];
    if (campo === 'cantidad') {
      const num = parseInt(valor) || 0;
      if (num >= 0) {
        nuevosDetalles[index].cantidad = num;
      }
    } else {
      if (valor === '' || /^\d{0,6}(\.\d{0,2})?$/.test(valor)) {
        nuevosDetalles[index].precioCompra = valor;
      }
    }
    setDetalles(nuevosDetalles);
  }

  function eliminarDetalle(index: number) {
    setDetalles(detalles.filter((_, i) => i !== index));
  }

  const total = detalles.reduce((sum, d) => {
    const precio = parseFloat(d.precioCompra) || 0;
    return sum + (d.cantidad * precio);
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!idProveedor) {
    toast.error('Selecciona un proveedor');
    return;
  }

  if (detalles.length === 0) {
    toast.error('Agrega al menos un producto');
    return;
  }

  if (!numeroComprobante.trim()) {
    toast.error('Ingresa el número de comprobante');
    return;
  }

  // Validar que todos los detalles tengan cantidad y precio válidos
  const detallesInvalidos = detalles.some(d => {
    const precio = parseFloat(d.precioCompra);
    return d.cantidad <= 0 || isNaN(precio) || precio <= 0;
  });

  if (detallesInvalidos) {
    toast.error('Verifica que todos los productos tengan cantidad y precio válidos');
    return;
  }

  setLoading(true);

  try {
    const dto: CrearCompraProductoDto = {
      idProveedor,
      fecha,
      tipoComprobante,
      numeroComprobante,
      observaciones: observaciones || undefined,
      detalles: detalles.map(d => ({
        idProducto: d.idProducto,
        cantidad: d.cantidad,
        precioCompra: parseFloat(d.precioCompra)
      }))
    };

    await compraProductoService.create(dto);
    toast.success('Compra registrada exitosamente');
    
    // 🔥 IMPORTANTE: Pequeño delay antes de cerrar el modal
    setTimeout(() => {
      onSuccess();
    }, 100);
    
  } catch (err: any) {
    console.error('Error:', err);
    toast.error(err.response?.data?.message || 'Error al registrar compra');
    setLoading(false); // 🔥 Solo restaurar loading si hay error
  }
}

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto" />
          <p className="text-gray-600 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Nueva Compra</h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Proveedor y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor*
              </label>
              <select
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - {p.ruc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tipo y Número de Comprobante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comprobante *
              </label>
              <select
                value={tipoComprobante}
                onChange={(e) => setTipoComprobante(e.target.value as TipoComprobanteCompra)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value={TipoComprobanteCompra.FACTURA}>Factura</option>
                <option value={TipoComprobanteCompra.BOLETA}>Boleta</option>
                <option value={TipoComprobanteCompra.GUIA}>Guía</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Comprobante *
              </label>
              <input
                type="text"
                value={numeroComprobante}
                onChange={(e) => setNumeroComprobante(e.target.value)}
                required
                placeholder="F001-00123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Notas adicionales sobre la compra..."
            />
          </div>

          {/* Productos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos</h3>
            
            {/* Buscar producto */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  placeholder="Buscar producto para agregar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              {/* Lista de productos filtrados */}
              {productosFiltrados.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {productosFiltrados.map(producto => (
                    <button
                      key={producto.id}
                      type="button"
                      onClick={() => agregarProducto(producto)}
                      className="w-full px-4 py-2 hover:bg-gray-50 text-left flex items-center justify-between border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{producto.nombre}</p>
                        <p className="text-xs text-gray-500">{producto.categoria} - Stock: {producto.stock}</p>
                      </div>
                      <Plus className="w-4 h-4 text-cyan-600" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de productos agregados */}
            {detalles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No hay productos agregados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {detalles.map((detalle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Info del producto */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{detalle.producto.nombre}</h4>
                        <p className="text-xs text-gray-500">{detalle.producto.categoria}</p>
                      </div>

                      {/* Cantidad */}
                      <div className="w-24">
                        <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={detalle.cantidad}
                          onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      {/* Precio */}
                      <div className="w-28">
                        <label className="block text-xs text-gray-600 mb-1">Precio S/</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={detalle.precioCompra}
                          onChange={(e) => actualizarDetalle(index, 'precioCompra', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="w-28">
                        <label className="block text-xs text-gray-600 mb-1">Subtotal</label>
                        <p className="text-sm font-semibold text-gray-800 py-1">
                          S/ {(detalle.cantidad * (parseFloat(detalle.precioCompra) || 0)).toFixed(2)}
                        </p>
                      </div>

                      {/* Eliminar */}
                      <button
                        type="button"
                        onClick={() => eliminarDetalle(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Total de la Compra</span>
              <span className="text-3xl font-bold text-cyan-600">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || detalles.length === 0}
              className="flex-1 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Registrar Compra'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}