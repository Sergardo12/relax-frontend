// components/domain/administrador/ModalDetalleVenta.tsx

"use client";

import { X, ShoppingCart, Calendar, FileText, CreditCard, Package, DollarSign, User } from "lucide-react";
import { VentaProductoResponse } from "@/types";

interface Props {
  venta: VentaProductoResponse;
  onClose: () => void;
}

export default function ModalDetalleVenta({ venta, onClose }: Props) {
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
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Detalle de Venta</h2>
              </div>
              <p className="text-green-100 text-sm">ID: {venta.id.slice(0, 8)}</p>
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
          
          {/* Información del Cliente */}
          {(venta.clienteNombre || venta.clienteDocumento) && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 mb-1">Cliente</p>
                  <h3 className="text-lg font-bold text-gray-800">
                    {venta.clienteNombre || 'Cliente General'}
                  </h3>
                  {venta.clienteDocumento && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Documento:</span> {venta.clienteDocumento}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Información de la Venta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha</span>
              </div>
              <p className="font-semibold text-gray-800">
                {formatearFecha(venta.fecha)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Comprobante</span>
              </div>
              <p className="font-semibold text-gray-800 uppercase">
                {venta.tipoComprobante}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Método de Pago</span>
              </div>
              <p className="font-semibold text-gray-800 capitalize">
                {venta.metodoPago}
              </p>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Estado de la Venta:</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {venta.estado}
              </span>
            </div>
          </div>

          {/* Observaciones */}
          {venta.observaciones && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-1">Observaciones</p>
              <p className="text-sm text-yellow-700">{venta.observaciones}</p>
            </div>
          )}

          {/* Productos Vendidos */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Productos Vendidos
            </h3>
            
            {!venta.detalles || venta.detalles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay detalles disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {venta.detalles.map((detalle, index) => (
                  <div
                    key={detalle.id}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Número */}
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
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
                            <p className="font-semibold text-gray-800">S/ {detalle.precioUnitario.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Subtotal</p>
                            <p className="font-semibold text-green-600">S/ {detalle.subtotal.toFixed(2)}</p>
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
                        <span className="font-medium">Precio de costo:</span> S/ {detalle.producto.precioCosto}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen de Totales */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-800">S/ {venta.subtotal.toFixed(2)}</span>
              </div>

              {/* Descuento */}
              {venta.descuento > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Descuento:</span>
                  <span className="font-semibold text-red-600">- S/ {venta.descuento.toFixed(2)}</span>
                </div>
              )}

              {/* IGV */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">IGV (18%):</span>
                <span className="font-semibold text-gray-800">S/ {venta.igv.toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="border-t-2 border-green-300 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de la Venta</p>
                    <p className="text-xs text-gray-500">{venta.detalles?.length || 0} producto(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-600">
                    S/ {venta.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info de registro */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Venta registrada el {new Date(venta.creadoEn).toLocaleString('es-PE')}</p>
            {venta.actualizadoEn !== venta.creadoEn && (
              <p>Última actualización: {new Date(venta.actualizadoEn).toLocaleString('es-PE')}</p>
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