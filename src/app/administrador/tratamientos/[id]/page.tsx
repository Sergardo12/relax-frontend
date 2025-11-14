"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useEffect, useState } from "react";
import { tratamientoService, sesionTratamientoService } from "@/services/api";
import { TratamientoResponse, SesionTratamientoResponse } from "@/types";
import { 
  ArrowLeft, User, Calendar, Activity, 
  Clock, CheckCircle, XCircle, Edit2 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date";

export default function DetalleTratamientoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [tratamiento, setTratamiento] = useState<TratamientoResponse | null>(null);
  const [sesiones, setSesiones] = useState<SesionTratamientoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Para COMPLETAR sesión
  const [completandoSesion, setCompletandoSesion] = useState<string | null>(null);
  const [observacionesCompletar, setObservacionesCompletar] = useState('');
  
  // Para REPROGRAMAR sesión
  const [editandoSesion, setEditandoSesion] = useState<string | null>(null);
  const [formEditSesion, setFormEditSesion] = useState({ fecha: '', hora: '', observaciones: '' });

  useEffect(() => {
    if (isAuthenticated) {
      cargarDatos();
    }
  }, [isAuthenticated, id]);

  async function cargarDatos() {
    try {
      const [tratData, sesionesData] = await Promise.all([
        tratamientoService.getTratamientoById(id as string),
        sesionTratamientoService.getByTratamiento(id as string),
      ]);
      setTratamiento(tratData);
      setSesiones(sesionesData);
    } catch (err) {
      toast.error("Error al cargar datos");
      router.push("/administrador/tratamientos");
    } finally {
      setLoading(false);
    }
  }

  // ========== COMPLETAR SESIÓN ==========
  async function completarSesion(sesionId: string) {
    try {
      await sesionTratamientoService.update(sesionId, { 
        observaciones: observacionesCompletar 
      } as any);
      toast.success("Sesión completada ✅");
      setCompletandoSesion(null);
      setObservacionesCompletar('');
      cargarDatos();
    } catch (err) {
      toast.error("Error al completar sesión");
    }
  }

  // ========== CANCELAR SESIÓN ==========
  async function cancelarSesion(sesionId: string) {
    if (confirm('¿Cancelar esta sesión?')) {
      try {
        await sesionTratamientoService.delete(sesionId);
        cargarDatos();
      } catch (err) {
        toast.error("Error al cancelar");
      }
    }
  }

  // ========== REPROGRAMAR SESIÓN ==========
  async function guardarReprogramacion(sesionId: string) {
    try {
      await sesionTratamientoService.update(sesionId, formEditSesion);
      toast.success("Sesión reprogramada ✅");
      setEditandoSesion(null);
      cargarDatos();
    } catch (err) {
      toast.error("Error al reprogramar");
    }
  }

  if (authLoading || !isAuthenticated) return null;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-cyan-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!tratamiento) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/administrador/tratamientos"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a tratamientos
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Detalle del Tratamiento</h1>
      </div>

      {/* Info Tratamiento */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-gray-700">Paciente</h3>
            </div>
            <p className="text-gray-800">{tratamiento.paciente.nombres} {tratamiento.paciente.apellidos}</p>
            <p className="text-sm text-gray-500">DNI: {tratamiento.paciente.dni}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Colaborador</h3>
            <p className="text-gray-800">{tratamiento.colaborador.nombres} {tratamiento.colaborador.apellidos}</p>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold text-gray-700 mb-2">Diagnóstico</h3>
            <p className="text-gray-800">{tratamiento.diagnostico}</p>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold text-gray-700 mb-2">Plan de Tratamiento</h3>
            <p className="text-gray-800">{tratamiento.tratamiento}</p>
          </div>

          <div className="col-span-2 grid grid-cols-4 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Inicio</p>
                <p className="font-medium">{formatDate(tratamiento.fechaInicio)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Sesiones</p>
                <p className="font-medium">{tratamiento.sesionesRealizadas}/{tratamiento.sesionesTotales}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Precio</p>
              <p className="font-medium">S/ {tratamiento.precioTotal}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${
                tratamiento.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' :
                tratamiento.estado === 'COMPLETADO' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {tratamiento.estado}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sesiones */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sesiones Programadas</h2>
        
        {sesiones.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay sesiones registradas</p>
        ) : (
          <div className="space-y-3">
            {sesiones.map((sesion, index) => (
              <div key={sesion.id} className="p-4 border border-gray-200 rounded-lg">
                
                {/* MODO: Completando sesión */}
                {completandoSesion === sesion.id ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-700">Completar Sesión {index + 1}</span>
                      <button
                        onClick={() => {
                          setCompletandoSesion(null);
                          setObservacionesCompletar('');
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                    
                    <textarea
                      value={observacionesCompletar}
                      onChange={(e) => setObservacionesCompletar(e.target.value)}
                      placeholder="¿Qué se realizó en esta sesión?"
                      rows={3}
                      className="w-full border rounded p-2"
                    />
                    
                    <button
                      onClick={() => completarSesion(sesion.id)}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Confirmar y Completar
                    </button>
                  </div>
                ) 
                
                /* MODO: Reprogramando sesión */
                : editandoSesion === sesion.id ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-cyan-700">Reprogramar Sesión {index + 1}</span>
                      <button
                        onClick={() => setEditandoSesion(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs mb-1">Nueva Fecha</label>
                        <input
                          type="date"
                          value={formEditSesion.fecha}
                          onChange={(e) => setFormEditSesion({...formEditSesion, fecha: e.target.value})}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Nueva Hora</label>
                        <input
                          type="time"
                          value={formEditSesion.hora}
                          onChange={(e) => setFormEditSesion({...formEditSesion, hora: e.target.value})}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    
                    <textarea
                      value={formEditSesion.observaciones}
                      onChange={(e) => setFormEditSesion({...formEditSesion, observaciones: e.target.value})}
                      placeholder="Motivo de la reprogramación..."
                      rows={2}
                      className="w-full border rounded p-2"
                    />
                    
                    <button
                      onClick={() => guardarReprogramacion(sesion.id)}
                      className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                ) 
                
                /* MODO: Vista normal */
                : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">Sesión {index + 1}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(sesion.fecha)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {sesion.hora}
                        </div>
                      </div>
                      {sesion.observaciones && (
                        <p className="text-sm text-gray-600">{sesion.observaciones}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        sesion.estado === 'realizada' ? 'bg-green-100 text-green-700' :
                        sesion.estado === 'cancelada' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sesion.estado}
                      </span>

                      {sesion.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => {
                              setEditandoSesion(sesion.id);
                              setFormEditSesion({
                                fecha: sesion.fecha,
                                hora: sesion.hora,
                                observaciones: sesion.observaciones || '',
                              });
                            }}
                            className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"
                            title="Reprogramar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setCompletandoSesion(sesion.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Completar sesión"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => cancelarSesion(sesion.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Cancelar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}