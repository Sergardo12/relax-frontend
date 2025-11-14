// components/domain/administrador/ModalAjustarStock.tsx

"use client";

import { useState } from "react";
import { X, Package, Plus, Minus, Loader2 } from "lucide-react";
import { productoService } from "@/services/api";
import { ProductoResponse } from "@/types";
import { toast } from "sonner";

interface Props {
  producto: ProductoResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalAjustarStock({ producto, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<'agregar' | 'restar'>('agregar');
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivo, setMotivo] = useState('');

  const nuevoStock = tipo === 'agregar' 
    ? producto.stock + cantidad 
    : producto.stock - cantidad;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!motivo.trim()) {
      toast.error('Debes ingresar un motivo');
      return;
    }

    if (cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    if (tipo === 'restar' && cantidad > producto.stock) {
      toast.error('No puedes restar más stock del disponible');
      return;
    }

    setLoading(true);

    try {
      const cantidadFinal = tipo === 'agregar' ? cantidad : -cantidad;
      await productoService.ajustarStock(producto.id, {
        cantidad: cantidadFinal,
        motivo
      });
      toast.success('Stock ajustado correctamente');
      onSuccess();
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error al ajustar stock');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6" />
              <h2 className="text-xl font-bold">Ajustar Stock</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-blue-100 mt-2">{producto.nombre}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Stock actual */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Stock Actual</p>
            <p className="text-3xl font-bold text-gray-800">{producto.stock}</p>
            <p className="text-xs text-gray-500 mt-1">unidades</p>
          </div>

          {/* Tipo de ajuste */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo('agregar')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                tipo === 'agregar'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
            <button
              type="button"
              onClick={() => setTipo('restar')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                tipo === 'restar'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Minus className="w-5 h-5" />
              Restar
            </button>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
              min="1"
              max={tipo === 'restar' ? producto.stock : undefined}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del ajuste *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ej: Compra a proveedor, devolución, producto dañado, etc."
            />
          </div>

          {/* Preview del nuevo stock */}
          <div className={`rounded-lg p-4 text-center ${
            nuevoStock < producto.stockMinimo 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-cyan-50 border border-cyan-200'
          }`}>
            <p className="text-sm text-gray-600 mb-1">Nuevo Stock</p>
            <p className={`text-2xl font-bold ${
              nuevoStock < producto.stockMinimo ? 'text-red-600' : 'text-cyan-600'
            }`}>
              {nuevoStock}
            </p>
            {nuevoStock < producto.stockMinimo && (
              <p className="text-xs text-red-600 mt-1">⚠️ Por debajo del stock mínimo</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
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
              Confirmar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}