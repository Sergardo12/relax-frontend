// components/domain/paciente/ModalDetalleCita.tsx

"use client";

import { X, Calendar, Clock, User, Scissors, CreditCard, Crown } from "lucide-react";
import { CitaResponse, DetalleCitaResponse } from "@/types";

interface Props {
  cita: CitaResponse;
  detalles: DetalleCitaResponse[];
  onClose: () => void;
}

export default function ModalDetalleCita({ cita, detalles, onClose }: Props) {
  const total = detalles.reduce((sum, d) => sum + Number(d.subtotal), 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Detalle de Cita</h2>
              <p className="text-cyan-100 text-sm mt-1">ID: {cita.id.slice(0, 8)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Información general */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha</span>
              </div>
              <p className="font-semibold text-gray-800">
                {new Date(cita.fecha.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Hora</span>
              </div>
              <p className="font-semibold text-gray-800">{cita.hora}</p>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-cyan-600" />
              Servicios Contratados
            </h3>
            <div className="space-y-3">
              {detalles.map((detalle) => (
                <div
                  key={detalle.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {detalle.servicio.nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {detalle.servicio.descripcion}
                      </p>
                    </div>
                    {detalle.esConMembresia ? (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        {detalle.colaborador.nombres} {detalle.colaborador.apellidos}
                      </span>
                    </div>
                    <div className="text-right">
                      {detalle.esConMembresia ? (
                        <span className="text-green-600 font-semibold text-sm">
                          Con membresía
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-800">
                          S/ {detalle.subtotal}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-cyan-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold text-gray-700">Total Pagado</span>
              </div>
              <span className="text-2xl font-bold text-cyan-600">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}