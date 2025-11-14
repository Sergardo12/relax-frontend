// components/domain/administrador/ModalDetalleGasto.tsx

"use client";

import { X, Receipt, Calendar, FileText, Truck, Package, DollarSign } from "lucide-react";
import { RegistroGastoResponse } from "@/types";

interface Props {
  gasto: RegistroGastoResponse;
  onClose: () => void;
}

export default function ModalDetalleGasto({ gasto, onClose }: Props) {
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

  const categoriasLabels: Record<string, string> = {
    'productos_limpieza': 'Productos de Limpieza',
    'insumos_masaje': 'Insumos de Masaje',
    'servicios_basicos': 'Servicios Básicos',
    'mantenimiento': 'Mantenimiento',
    'otros': 'Otros'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Detalle de Gasto</h2>
              </div>
              <p className="text-orange-100 text-sm">ID: {gasto.id.slice(0, 8)}</p>
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">Proveedor</p>
                <h3 className="text-lg font-bold text-gray-800">{gasto.proveedor.nombre}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">RUC:</span> {gasto.proveedor.ruc}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {gasto.proveedor.telefono}
                  </p>
                  {gasto.proveedor.email && (
                    <p className="text-sm text-gray-600 col-span-2">
                      <span className="font-medium">Email:</span> {gasto.proveedor.email}
                    </p>
                  )}
                  {gasto.proveedor.direccion && (
                    <p className="text-sm text-gray-600 col-span-2">
                      <span className="font-medium">Dirección:</span> {gasto.proveedor.direccion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información del Gasto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha</span>
              </div>
              <p className="font-semibold text-gray-800">
                {formatearFecha(gasto.fecha)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Comprobante</span>
              </div>
              <p className="font-semibold text-gray-800 uppercase">
                {gasto.tipoComprobante}
              </p>
              <p className="text-sm text-gray-600">{gasto.numeroComprobante}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Categoría</span>
              </div>
              <p className="font-semibold text-gray-800">
                {categoriasLabels[gasto.categoria] || gasto.categoria}
              </p>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Estado del Gasto:</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                {gasto.estado}
              </span>
            </div>
          </div>

          {/* Observaciones */}
          {gasto.observaciones && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-1">Observaciones</p>
              <p className="text-sm text-yellow-700">{gasto.observaciones}</p>
            </div>
          )}

          {/* Detalles del Gasto */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Detalles del Gasto
            </h3>
            
            {!gasto.detalles || gasto.detalles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay detalles disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gasto.detalles.map((detalle, index) => (
                  <div
                    key={detalle.id}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Número */}
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {index + 1}
                        </div>

                        {/* Descripción */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800">
                            {detalle.descripcion}
                          </h4>
                        </div>
                      </div>

                      {/* Cantidades y precios */}
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
                            <p className="font-semibold text-orange-600">S/ {detalle.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen Total */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total del Gasto</p>
                  <p className="text-xs text-gray-500">{gasto.detalles?.length || 0} detalle(s)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-orange-600">
                  S/ {gasto.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Info de registro */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Gasto registrado el {new Date(gasto.creadoEn).toLocaleString('es-PE')}</p>
            {gasto.actualizadoEn !== gasto.creadoEn && (
              <p>Última actualización: {new Date(gasto.actualizadoEn).toLocaleString('es-PE')}</p>
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