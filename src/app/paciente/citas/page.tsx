// app/paciente/citas/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/lib/store";
import { citaService, detalleCitaService } from "@/services/api";
import { CitaResponse, DetalleCitaResponse } from "@/types";
import { Calendar, Clock, MapPin, User, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalDetalleCita from "@/components/domain/paciente/ModalDetalleCita";


export default function MisCitasPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['paciente'] });
  const { obtenerDatosCompletos } = useAuthStore();
  
  const [citas, setCitas] = useState<CitaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaResponse | null>(null);
  const [detallesCita, setDetallesCita] = useState<DetalleCitaResponse[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      cargarCitas();
    }
  }, [isAuthenticated]);

  async function cargarCitas() {
    try {
      const datos = await obtenerDatosCompletos();
      if (datos?.id) {
        const response = await citaService.getMisCitas()
        // Ordenar por fecha más reciente
        const ordenadas = response.sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`);
          const fechaB = new Date(`${b.fecha}T${b.hora}`);
          return fechaB.getTime() - fechaA.getTime();
        });
        setCitas(ordenadas);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  }

  async function verDetalle(cita: CitaResponse) {
    try {
      const detalles = await detalleCitaService.getByCita(cita.id);
      setDetallesCita(detalles);
      setCitaSeleccionada(cita);
    } catch (err) {
      toast.error("Error al cargar detalles");
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'bg-green-100 text-green-700';
      case 'pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'completada': return 'bg-blue-100 text-blue-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (authLoading || !isAuthenticated) return null;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mis Citas</h1>
          <p className="text-gray-600 mt-2">
            Historial completo de tus reservas en el spa
          </p>
        </div>

        {/* Lista de citas */}
        {citas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes citas registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {citas.map((cita) => (
              <div
                key={cita.id}
                onClick={() => verDetalle(cita)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(cita.estado)}`}>
                        {cita.estado}
                      </span>
                      <span className="text-sm text-gray-500">
                        Cita #{cita.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(cita.fecha.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{cita.hora}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Centro Relax Spa</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {citaSeleccionada && (
        <ModalDetalleCita
          cita={citaSeleccionada}
          detalles={detallesCita}
          onClose={() => {
            setCitaSeleccionada(null);
            setDetallesCita([]);
          }}
        />
      )}
    </Layout>
  );
}