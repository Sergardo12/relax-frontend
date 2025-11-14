// components/domain/administrador/ModalProducto.tsx

"use client";

import { useState } from "react";
import { X, Package, Loader2 } from "lucide-react";
import { productoService } from "@/services/api";
import { ProductoResponse, CrearProductoDto, ActualizarProductoDto, CategoriaProducto } from "@/types";
import { toast } from "sonner";

interface Props {
  producto?: ProductoResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalProducto({ producto, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  
  // 🔥 Manejar precios como strings para mejor UX
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [precioCosto, setPrecioCosto] = useState(producto?.precioCosto?.toString() || '');
  const [precioVenta, setPrecioVenta] = useState(producto?.precioVenta?.toString() || '');
  const [stock, setStock] = useState(producto?.stock?.toString() || '');
  const [categoria, setCategoria] = useState(producto?.categoria || CategoriaProducto.OTROS);
  const [fechaVencimiento, setFechaVencimiento] = useState(producto?.fechaVencimiento || '');
  const [lote, setLote] = useState(producto?.lote || '');

  // 🔥 Calcular margen
  const costoNum = parseFloat(precioCosto) || 0;
  const ventaNum = parseFloat(precioVenta) || 0;
  const margen = costoNum > 0 && ventaNum > 0
    ? (((ventaNum - costoNum) / costoNum) * 100)
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones
    const costoFinal = parseFloat(precioCosto);
    const ventaFinal = parseFloat(precioVenta);
    const stockFinal = parseFloat(stock);

    if (isNaN(costoFinal) || costoFinal < 0) {
      toast.error('El precio de costo debe ser un número válido mayor o igual a 0');
      return;
    }

    if (isNaN(ventaFinal) || ventaFinal < 0) {
      toast.error('El precio de venta debe ser un número válido mayor o igual a 0');
      return;
    }

    if (!producto && (isNaN(stockFinal) || stockFinal < 0)) {
      toast.error('El stock debe ser un número válido mayor o igual a 0');
      return;
    }

    setLoading(true);

    try {
      if (producto) {
        // Actualizar producto
        const updateDto: ActualizarProductoDto = {
          nombre,
          descripcion: descripcion || undefined,
          precioCosto: costoFinal,
          precioVenta: ventaFinal,
          stockMinimo: 5, // 🔥 Fijo en 5
          categoria,
          fechaVencimiento: fechaVencimiento || undefined,
          lote: lote || undefined,
        };
        await productoService.update(producto.id, updateDto);
        toast.success('Producto actualizado');
      } else {
        // Crear producto
        const createDto: CrearProductoDto = {
          nombre,
          descripcion: descripcion || undefined,
          precioCosto: costoFinal,
          precioVenta: ventaFinal,
          stock: stockFinal,
          stockMinimo: 5, // 🔥 Fijo en 5
          categoria,
          fechaVencimiento: fechaVencimiento || undefined,
          lote: lote || undefined,
        };
        await productoService.create(createDto);
        toast.success('Producto creado');
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                {producto ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ej: Crema Hidratante Premium"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Descripción del producto..."
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaProducto)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {Object.values(CategoriaProducto).map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Precios */}
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio de Costo (S/) *
            </label>
            <input
            type="text"
            inputMode="decimal"
            value={precioCosto}
            onChange={(e) => {
                const value = e.target.value;
                // 🔥 Permitir: hasta 10 dígitos, punto decimal, y hasta 2 decimales
                if (value === '' || /^\d{0,3}(\.\d{0,2})?$/.test(value)) {
                setPrecioCosto(value);
                }
            }}
            onBlur={() => {
                // Al salir, formatear solo si hay un valor válido
                const num = parseFloat(precioCosto);
                if (!isNaN(num) && num >= 0) {
                setPrecioCosto(num.toFixed(2));
                } else if (precioCosto === '') {
                // Si está vacío, dejar vacío
                setPrecioCosto('');
                } else {
                // Si es inválido, limpiar
                setPrecioCosto('');
                toast.error('Precio de costo inválido');
                }
            }}
            required
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
            Máximo: S/ 999.99
            </p>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio de Venta (S/) *
            </label>
            <input
            type="text"
            inputMode="decimal"
            value={precioVenta}
            onChange={(e) => {
                const value = e.target.value;
                // 🔥 Permitir: hasta 10 dígitos, punto decimal, y hasta 2 decimales
                if (value === '' || /^\d{0,4}(\.\d{0,2})?$/.test(value)) {
                setPrecioVenta(value);
                }
            }}
            onBlur={() => {
                const num = parseFloat(precioVenta);
                if (!isNaN(num) && num >= 0) {
                setPrecioVenta(num.toFixed(2));
                } else if (precioVenta === '') {
                setPrecioVenta('');
                } else {
                setPrecioVenta('');
                toast.error('Precio de venta inválido');
                }
            }}
            required
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
            Máximo: S/999.99
            </p>
        </div>
        </div>
          {/* Margen de ganancia con colores */}
          {costoNum > 0 && ventaNum > 0 && (
            <div className={`border rounded-lg p-3 ${
              margen < 0 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm ${margen < 0 ? 'text-red-700' : 'text-green-700'}`}>
                Margen de ganancia: <span className="font-semibold">
                  {margen.toFixed(1)}%
                </span>
                {margen < 0 && ' ⚠️ Estás vendiendo con pérdida'}
              </p>
            </div>
          )}

          {/* Stock */}
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Actual * {producto && '(no editable)'}
            </label>
            <input
            type="text"
            inputMode="numeric"
            value={producto ? producto.stock : stock}
            onChange={(e) => {
                const value = e.target.value;
                // 🔥 Permitir solo números enteros, máximo 10 dígitos
                if (value === '' || /^\d{0,10}$/.test(value)) {
                setStock(value);
                }
            }}
            onBlur={() => {
                // Validar al salir del campo
                const num = parseInt(stock);
                if (!isNaN(num) && num >= 0) {
                setStock(num.toString());
                } else if (stock === '') {
                setStock('');
                } else {
                setStock('');
                toast.error('Stock inválido');
                }
            }}
            required={!producto}
            disabled={!!producto}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {producto ? (
            <p className="text-xs text-gray-500 mt-1">
                Usa "Ajustar Stock" para modificar
            </p>
            ) : (
            <p className="text-xs text-gray-500 mt-1">
                Máximo: 9,999,999,999 unidades
            </p>
            )}
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Mínimo
            </label>
            <input
            type="text"
            value="5"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
            Valor fijo del sistema
            </p>
        </div>
        </div>
          {/* Lote y Vencimiento (Opcional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lote (opcional)
              </label>
              <input
                type="text"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ej: LOTE-2024-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento (opcional)
              </label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {producto ? 'Actualizar' : 'Crear'} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}