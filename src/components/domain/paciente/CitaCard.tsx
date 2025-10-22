"use client";

import { CitaResponse, CitaEstado, EstadoPago } from "@/types";
import { Calendar, Clock, ChevronRight } from "lucide-react";

interface CitaCardProps {
  cita: CitaResponse;
  onClick?: () => void;
}

export default function CitaCard({ cita, onClick }: CitaCardProps) {
  // 🎨 Colores según el estado
  const getEstadoColor = (estado: CitaEstado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPagoColor = (estado: EstadoPago) => {
    switch (estado) {
      case 'pagado':
        return 'text-green-600';
      case 'pendiente':
        return 'text-yellow-600';
      case 'fallido':
        return 'text-red-600';
      case 'reembolsado':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPagoIcon = (estado: EstadoPago) => {
    switch (estado) {
      case 'pagado':
        return '✓';
      case 'pendiente':
        return '⏳';
      case 'fallido':
        return '✗';
      case 'reembolsado':
        return '↩';
      default:
        return '○';
    }
  };

  // 📅 Formatear fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden"
    >
      {/* Header con estado */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(cita.estado)}`}>
          {cita.estado.toUpperCase()}
        </span>
        
        <div className={`flex items-center gap-1.5 text-sm font-medium ${getPagoColor(cita.estadoPago)}`}>
          <span>{getPagoIcon(cita.estadoPago)}</span>
          <span className="capitalize">{cita.estadoPago}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Fecha */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Fecha shibac</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {formatearFecha(cita.fecha)}
            </p>
          </div>
        </div>

        {/* Hora */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Hora</p>
            <p className="text-sm font-semibold text-gray-800">{cita.hora}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-cyan-50 transition-colors">
        <span className="text-xs text-gray-500">
          ID: {cita.id.slice(0, 8)}...
        </span>
        <div className="flex items-center gap-1 text-cyan-600 text-sm font-medium group-hover:gap-2 transition-all">
          <span>Ver detalles</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}