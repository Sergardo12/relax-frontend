// app/paciente/tratamientos/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/lib/store";
import { tratamientoService, sesionTratamientoService } from "@/services/api";
import { TratamientoResponse, SesionTratamientoResponse } from "@/types";
import { Activity, Calendar, CheckCircle, Clock, User, Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalDetalleTratamiento from "@/components/domain/paciente/ModalDatalleTratamiento";


export default function MisTratamientosPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['paciente'] });
  const { obtenerDatosCompletos } = useAuthStore();
  
  const [tratamientos, setTratamientos] = useState<TratamientoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<TratamientoResponse | null>(null);
  const [sesiones, setSesiones] = useState<SesionTratamientoResponse[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      cargarTratamientos();
    }
  }, [isAuthenticated]);

  async function cargarTratamientos() {
    try {
      const datos = await obtenerDatosCompletos();
      if (datos?.id) {
        const response = await tratamientoService.getTratamientosByPaciente(datos.id);
        // Ordenar por fecha más reciente
        const ordenados = response.sort((a, b) => {
          return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
        });
        setTratamientos(ordenados);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar tratamientos");
    } finally {
      setLoading(false);
    }
  }

  async function verDetalle(tratamiento: TratamientoResponse) {
    try {
      const sesionesData = await sesionTratamientoService.getByTratamiento(tratamiento.id);
      setSesiones(sesionesData);
      setTratamientoSeleccionado(tratamiento);
    } catch (err) {
      toast.error("Error al cargar sesiones");
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-green-100 text-green-700';
      case 'COMPLETADO': return 'bg-blue-100 text-blue-700';
      case 'SUSPENDIDO': return 'bg-red-100 text-red-700';
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
          <h1 className="text-3xl font-bold text-gray-800">Mis Tratamientos</h1>
          <p className="text-gray-600 mt-2">
            Seguimiento de tus planes terapéuticos
          </p>
        </div>

        {/* Lista de tratamientos */}
        {tratamientos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes tratamientos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tratamientos.map((tratamiento) => {
              const progreso = (tratamiento.sesionesRealizadas / tratamiento.sesionesTotales) * 100;
              return (
                <div
                  key={tratamiento.id}
                  onClick={() => verDetalle(tratamiento)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(tratamiento.estado)}`}>
                          {tratamiento.estado}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {tratamiento.tratamiento}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {tratamiento.diagnostico}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Info adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(tratamiento.fechaInicio.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">
                        {tratamiento.colaborador.nombres} {tratamiento.colaborador.apellidos}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">
                        {tratamiento.sesionesRealizadas} de {tratamiento.sesionesTotales} sesiones
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-semibold text-cyan-600">{Math.round(progreso)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {tratamientoSeleccionado && (
        <ModalDetalleTratamiento
          tratamiento={tratamientoSeleccionado}
          sesiones={sesiones}
          onClose={() => {
            setTratamientoSeleccionado(null);
            setSesiones([]);
          }}
        />
      )}
    </Layout>
  );
}