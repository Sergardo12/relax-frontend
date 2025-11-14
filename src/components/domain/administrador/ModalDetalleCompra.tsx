// components/domain/administrador/ModalDetalleCompra.tsx

"use client";

import { X, ShoppingBag, Calendar, FileText, Truck, Package, DollarSign } from "lucide-react";
import { CompraProductoResponse } from "@/types";

interface Props {
  compra: CompraProductoResponse;
  onClose: () => void;
}

export default function ModalDetalleCompra({ compra, onClose }: Props) {
  const formatearFecha = (fecha: string) => {
    const soloFecha = fecha.split('T')[0];
    const [year, month, day] = soloFecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Detalle de Compra</h2>
              </div>
              <p className="text-blue-100 text-sm">ID: {compra.id.slice(0, 8)}</p>
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

        {/* Contenido */}
        <div className="p-6 space-y-6">
          
          {/* Información del Proveedor */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">Proveedor</p>
                <h3 className="text-lg font-bold text-gray-800">{compra.proveedor.nombre}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">RUC:</span> {compra.proveedor.ruc}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {compra.proveedor.telefono}
                  </p>
                  {compra.proveedor.email && (
                    <p className="text-sm text-gray-600 col-span-2">
                      <span className="font-medium">Email:</span> {compra.proveedor.email}
                    </p>
                  )}
                  {compra.proveedor.direccion && (
                    <p className="text-sm text-gray-600 col-span-2">
                      <span className="font-medium">Dirección:</span> {compra.proveedor.direccion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de la Compra */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha</span>
              </div>
              <p className="font-semibold text-gray-800">
                {formatearFecha(compra.fecha)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Comprobante</span>
              </div>
              <p className="font-semibold text-gray-800 uppercase">
                {compra.tipoComprobante}
              </p>
              <p className="text-sm text-gray-600">{compra.numeroComprobante}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Estado</span>
              </div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {compra.estado}
              </span>
            </div>
          </div>

          {/* Observaciones */}
          {compra.observaciones && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-1">Observaciones</p>
              <p className="text-sm text-yellow-700">{compra.observaciones}</p>
            </div>
          )}

          {/* Productos Comprados */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-600" />
              Productos Comprados
            </h3>
            
            <div className="space-y-3">
              {compra.detalles?.map((detalle, index) => (
                <div
                  key={detalle.id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Número */}
                      <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>

                      {/* Info del producto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800">
                          {detalle.producto.nombre}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {detalle.producto.categoria} - Código: {detalle.producto.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    {/* Precios y cantidades */}
                    <div className="text-right ml-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Cantidad</p>
                          <p className="font-semibold text-gray-800">{detalle.cantidad}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Precio Unit.</p>
                          <p className="font-semibold text-gray-800">S/ {detalle.precioCompra.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Subtotal</p>
                          <p className="font-semibold text-cyan-600">S/ {detalle.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info adicional del producto */}
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Stock actual:</span> {detalle.producto.stock} unidades
                    </div>
                    <div>
                      <span className="font-medium">Precio de venta:</span> S/ {detalle.producto.precioVenta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen Total */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de la Compra</p>
                  <p className="text-xs text-gray-500">{compra.detalles?.length || 0} producto(s)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-cyan-600">
                  S/ {compra.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Info de registro */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Compra registrada el {new Date(compra.creadoEn).toLocaleString('es-PE')}</p>
            {compra.actualizadoEn !== compra.creadoEn && (
              <p>Última actualización: {new Date(compra.actualizadoEn).toLocaleString('es-PE')}</p>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}