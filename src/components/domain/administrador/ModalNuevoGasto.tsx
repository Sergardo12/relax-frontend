// components/domain/administrador/ModalNuevoGasto.tsx

"use client";

import { useState, useEffect } from "react";
import { X, Receipt, Loader2, Plus, Trash2, Search } from "lucide-react";
import { registroGastoService, proveedorInsumoService } from "@/services/api";
import { ProveedorInsumoResponse, CrearRegistroGastoDto, CategoriaGasto, TipoComprobanteGasto } from "@/types";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface DetalleItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: string;
}

export default function ModalNuevoGasto({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Datos
  const [proveedores, setProveedores] = useState<ProveedorInsumoResponse[]>([]);
  
  // Form
  const [idProveedor, setIdProveedor] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState<CategoriaGasto>(CategoriaGasto.OTROS);
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobanteGasto>(TipoComprobanteGasto.BOLETA);
  const [numeroComprobante, setNumeroComprobante] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  // Detalles
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const proveedoresData = await proveedorInsumoService.getAll();
      setProveedores(proveedoresData.filter(p => p.estado === 'activo'));
    } catch (err) {
      toast.error("Error al cargar datos");
    } finally {
      setLoadingData(false);
    }
  }

  function agregarDetalle() {
    if (!nuevaDescripcion.trim()) {
      toast.error('Ingresa una descripción');
      return;
    }

    setDetalles([...detalles, {
      descripcion: nuevaDescripcion,
      cantidad: 1,
      precioUnitario: '0'
    }]);
    setNuevaDescripcion('');
  }

  function actualizarDetalle(index: number, campo: keyof DetalleItem, valor: string) {
    const nuevosDetalles = [...detalles];
    
    if (campo === 'cantidad') {
      const num = parseInt(valor) || 0;
      if (num >= 0) {
        nuevosDetalles[index].cantidad = num;
      }
    } else if (campo === 'precioUnitario') {
      if (valor === '' || /^\d{0,6}(\.\d{0,2})?$/.test(valor)) {
        nuevosDetalles[index].precioUnitario = valor;
      }
    } else {
      nuevosDetalles[index][campo] = valor;
    }
    
    setDetalles(nuevosDetalles);
  }

  function eliminarDetalle(index: number) {
    setDetalles(detalles.filter((_, i) => i !== index));
  }

  const total = detalles.reduce((sum, d) => {
    const precio = parseFloat(d.precioUnitario) || 0;
    return sum + (d.cantidad * precio);
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!idProveedor) {
      toast.error('Selecciona un proveedor');
      return;
    }

    if (detalles.length === 0) {
      toast.error('Agrega al menos un detalle de gasto');
      return;
    }

    if (!numeroComprobante.trim()) {
      toast.error('Ingresa el número de comprobante');
      return;
    }

    // Validar que todos los detalles tengan datos válidos
    const detallesInvalidos = detalles.some(d => {
      const precio = parseFloat(d.precioUnitario);
      return !d.descripcion.trim() || d.cantidad <= 0 || isNaN(precio) || precio <= 0;
    });

    if (detallesInvalidos) {
      toast.error('Verifica que todos los detalles tengan descripción, cantidad y precio válidos');
      return;
    }

    setLoading(true);

    try {
      const dto: CrearRegistroGastoDto = {
        idProveedor,
        fecha,
        categoria,
        tipoComprobante,
        numeroComprobante,
        observaciones: observaciones || undefined,
        detalles: detalles.map(d => ({
          descripcion: d.descripcion,
          cantidad: d.cantidad,
          precioUnitario: parseFloat(d.precioUnitario)
        }))
      };

      await registroGastoService.create(dto);
      toast.success('Gasto registrado exitosamente');
      
      setTimeout(() => {
        onSuccess();
      }, 100);
      
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error al registrar gasto');
      setLoading(false);
    }
  }

  const categoriasLabels: Record<CategoriaGasto, string> = {
    [CategoriaGasto.PRODUCTOS_LIMPIEZA]: 'Productos de Limpieza',
    [CategoriaGasto.INSUMOS_MASAJE]: 'Insumos de Masaje',
    [CategoriaGasto.SERVICIOS_BASICOS]: 'Servicios Básicos',
    [CategoriaGasto.MANTENIMIENTO]: 'Mantenimiento',
    [CategoriaGasto.OTROS]: 'Otros'
  };

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
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Nuevo Gasto</h2>
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
                Proveedor *
              </label>
              <select
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categoría y Tipo de Comprobante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaGasto)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.entries(categoriasLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comprobante *
              </label>
              <select
                value={tipoComprobante}
                onChange={(e) => setTipoComprobante(e.target.value as TipoComprobanteGasto)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value={TipoComprobanteGasto.FACTURA}>Factura</option>
                <option value={TipoComprobanteGasto.BOLETA}>Boleta</option>
                <option value={TipoComprobanteGasto.RECIBO}>Recibo</option>
              </select>
            </div>
          </div>

          {/* Número de Comprobante */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Notas adicionales sobre el gasto..."
            />
          </div>

          {/* Detalles */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Gasto</h3>
            
            {/* Agregar nuevo detalle */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarDetalle();
                  }
                }}
                placeholder="Descripción del gasto..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={agregarDetalle}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            {/* Lista de detalles */}
            {detalles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No hay detalles agregados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {detalles.map((detalle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Descripción */}
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Descripción</label>
                        <input
                          type="text"
                          value={detalle.descripcion}
                          onChange={(e) => actualizarDetalle(index, 'descripcion', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
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
                          value={detalle.precioUnitario}
                          onChange={(e) => actualizarDetalle(index, 'precioUnitario', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                        className="p-1 text-red-600 hover:bg-red-50 rounded mt-5"
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
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Total del Gasto</span>
              <span className="text-3xl font-bold text-orange-600">
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
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || detalles.length === 0}
              className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Registrar Gasto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}