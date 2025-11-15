// components/domain/administrador/ModalNuevaVenta.tsx

"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, Loader2, Plus, Trash2, Search } from "lucide-react";
import { ventaProductoService, productoService } from "@/services/api";
import { ProductoResponse, CrearVentaProductoDto, TipoComprobanteVenta, MetodoPagoVenta } from "@/types";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface DetalleItem {
  idProducto: string;
  producto: ProductoResponse;
  cantidad: number;
  precioUnitario: string;
}

export default function ModalNuevaVenta({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Datos
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  
  // Form
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobanteVenta>(TipoComprobanteVenta.BOLETA);
  const [metodoPago, setMetodoPago] = useState<MetodoPagoVenta>(MetodoPagoVenta.EFECTIVO);
  const [descuento, setDescuento] = useState('0');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteDocumento, setClienteDocumento] = useState('');
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
        p.stock > 0 &&
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
      const productosData = await productoService.getAll();
      setProductos(productosData.filter(p => p.estado === 'activo' && p.stock > 0));
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
      precioUnitario: producto.precioVenta.toString()
    }]);
    setBusquedaProducto('');
  }

  function actualizarCantidad(index: number, valor: string) {
  const nuevosDetalles = [...detalles];
  const num = parseInt(valor) || 0;
  if (num >= 0 && num <= nuevosDetalles[index].producto.stock) {
    nuevosDetalles[index].cantidad = num;
  }
  setDetalles(nuevosDetalles);
}

  function eliminarDetalle(index: number) {
    setDetalles(detalles.filter((_, i) => i !== index));
  }

 // Cálculos (los precios YA incluyen IGV)
const subtotalConIGV = detalles.reduce((sum, d) => {
  const precio = parseFloat(d.precioUnitario) || 0;
  return sum + (d.cantidad * precio);
}, 0);

const descuentoNum = parseFloat(descuento) || 0;
const totalConDescuento = subtotalConIGV - descuentoNum;

// Descomponer el IGV (los precios ya lo incluyen)
const base = totalConDescuento / 1.18;
const igv = totalConDescuento - base;
const total = totalConDescuento;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (detalles.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }


    // Validar que todos los detalles tengan cantidad y precio válidos
    const detallesInvalidos = detalles.some(d => {
      const precio = parseFloat(d.precioUnitario);
      return d.cantidad <= 0 || isNaN(precio) || precio <= 0;
    });

    if (detallesInvalidos) {
      toast.error('Verifica que todos los productos tengan cantidad y precio válidos');
      return;
    }

    // Validar stock
    const sinStock = detalles.some(d => d.cantidad > d.producto.stock);
    if (sinStock) {
      toast.error('Algunos productos no tienen stock suficiente');
      return;
    }

    setLoading(true);

    try {
      const dto: CrearVentaProductoDto = {
        fecha,
        tipoComprobante,
        metodoPago,
        descuento: descuentoNum > 0 ? descuentoNum : undefined,
        clienteNombre: clienteNombre || undefined,
        clienteDocumento: clienteDocumento || undefined,
        observaciones: observaciones || undefined,
        detalles: detalles.map(d => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
        }))
      };

      await ventaProductoService.create(dto);
      toast.success('Venta registrada exitosamente');
      
      setTimeout(() => {
        onSuccess();
      }, 100);
      
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error al registrar venta');
      setLoading(false);
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
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Nueva Venta</h2>
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
          
          {/* Fecha y Tipo de Comprobante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comprobante *
              </label>
              <select
                value={tipoComprobante}
                onChange={(e) => setTipoComprobante(e.target.value as TipoComprobanteVenta)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={TipoComprobanteVenta.BOLETA}>Boleta</option>
                <option value={TipoComprobanteVenta.FACTURA}>Factura</option>
                <option value={TipoComprobanteVenta.TICKET}>Ticket</option>
              </select>
            </div>
          </div>

          {/* Número de Comprobante y Método de Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPagoVenta)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={MetodoPagoVenta.EFECTIVO}>Efectivo</option>
                <option value={MetodoPagoVenta.TARJETA}>Tarjeta</option>
                <option value={MetodoPagoVenta.TRANSFERENCIA}>Transferencia</option>
                <option value={MetodoPagoVenta.YAPE}>Yape</option>
                <option value={MetodoPagoVenta.PLIN}>Plin</option>
              </select>
            </div>
          </div>

          {/* Cliente (Opcional) */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos del Cliente (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="María González"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documento (DNI/RUC)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={clienteDocumento}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d{0,11}$/.test(value)) {
                      setClienteDocumento(value);
                    }
                  }}
                  placeholder="12345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        <p className="text-xs text-gray-500">
                          {producto.categoria} - Stock: {producto.stock} - S/ {producto.precioVenta}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-green-600" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de productos agregados */}
            {detalles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
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
                        <p className="text-xs text-gray-500">
                          Stock disponible: {detalle.producto.stock}
                        </p>
                      </div>

                      {/* Cantidad */}
                      <div className="w-24">
                        <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={detalle.cantidad}
                          onChange={(e) => actualizarCantidad(index, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      {/* Precio - NO EDITABLE */}
                      <div className="w-28">
                        <label className="block text-xs text-gray-600 mb-1">Precio S/</label>
                        <input
                          type="text"
                          value={detalle.precioUnitario}
                          disabled
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 cursor-not-allowed"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="w-28">
                        <label className="block text-xs text-gray-600 mb-1">Subtotal</label>
                        <p className="text-sm font-semibold text-gray-800 py-1">
                          S/ {(detalle.cantidad * (parseFloat(detalle.precioUnitario) || 0)).toFixed(2)}
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

          {/* Descuento y Observaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descuento (S/)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={descuento}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d{0,6}(\.\d{0,2})?$/.test(value)) {
                    setDescuento(value);
                  }
                }}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <input
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Notas adicionales..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Resumen de Totales */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal (con IGV):</span>
                <span className="font-semibold text-gray-800">S/ {subtotalConIGV.toFixed(2)}</span>
              </div>
              {descuentoNum > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuento:</span>
                  <span className="font-semibold text-red-600">- S/ {descuentoNum.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IGV (18%):</span>
                <span className="font-semibold text-gray-800">S/ {igv.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-green-300 pt-2 flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-3xl font-bold text-green-600">S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || detalles.length === 0}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Registrar Venta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}