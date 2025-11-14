// components/domain/paciente/ModalDetalleTratamiento.tsx

"use client";

import { X, Activity, Calendar, User, CheckCircle, Clock, FileText } from "lucide-react";
import { TratamientoResponse, SesionTratamientoResponse } from "@/types";

interface Props {
  tratamiento: TratamientoResponse;
  sesiones: SesionTratamientoResponse[];
  onClose: () => void;
}

export default function ModalDetalleTratamiento({ tratamiento, sesiones, onClose }: Props) {
  const progreso = (tratamiento.sesionesRealizadas / tratamiento.sesionesTotales) * 100;

  const getEstadoSesion = (estado: string) => {
    switch (estado) {
      case 'realizada': return { color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'programada': return { color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'cancelada': return { color: 'bg-red-100 text-red-700', icon: X };
      default: return { color: 'bg-gray-100 text-gray-700', icon: Clock };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Detalle del Tratamiento</h2>
              </div>
              <p className="text-cyan-100 text-sm">ID: {tratamiento.id.slice(0, 8)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          
          {/* Información general */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              {tratamiento.tratamiento}
            </h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm font-medium text-blue-800 mb-1">Diagnóstico</p>
              <p className="text-sm text-blue-700">{tratamiento.diagnostico}</p>
            </div>
          </div>

          {/* Progreso */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Progreso del Tratamiento</span>
              <span className="text-2xl font-bold text-cyan-600">{Math.round(progreso)}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {tratamiento.sesionesRealizadas} de {tratamiento.sesionesTotales} sesiones completadas
            </p>
          </div>

          {/* Info adicional */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Terapeuta</span>
              </div>
              <p className="font-semibold text-gray-800">
                {tratamiento.colaborador.nombres} {tratamiento.colaborador.apellidos}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha de inicio</span>
              </div>
              <p className="font-semibold text-gray-800">
                {new Date(tratamiento.fechaInicio.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {tratamiento.fechaFin && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Fecha de fin</span>
                </div>
                <p className="font-semibold text-gray-800">
                  {new Date(tratamiento.fechaFin.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Estado</span>
              </div>
              <p className="font-semibold text-gray-800">{tratamiento.estado}</p>
            </div>
          </div>

          {/* Sesiones */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Historial de Sesiones
            </h3>
            
            {sesiones.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay sesiones registradas</p>
            ) : (
              <div className="space-y-3">
                {sesiones.map((sesion, index) => {
                  const estadoInfo = getEstadoSesion(sesion.estado);
                  const EstadoIcon = estadoInfo.icon;

                  return (
                    <div
                      key={sesion.id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-cyan-100 text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {new Date(sesion.fecha).toLocaleDateString('es-PE', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </p>
                            <p className="text-sm text-gray-500">{sesion.hora}</p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${estadoInfo.color}`}>
                          <EstadoIcon className="w-3 h-3" />
                          {sesion.estado}
                        </span>
                      </div>
                      
                      {sesion.observaciones && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">{sesion.observaciones}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}