// app/administrador/citas/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { citaService, detalleCitaService } from "@/services/api";
import { CitaResponse, CitaEstado, DetalleCitaResponse } from "@/types";
import { Calendar, Search, Filter, Eye, Loader2, User, Activity } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date";
import Modal from "@/components/domain/shared/Modal";

export default function CitasAdminPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [citas, setCitas] = useState<CitaResponse[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<CitaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todas');
  const [detallesCita, setDetallesCita] = useState<DetalleCitaResponse[]>([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  
  // Modal
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarCitas();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarCitas();
  }, [citas, busqueda, estadoFiltro]);

  async function cargarCitas() {
    try {
      const data = await citaService.getAll();
      const ordenadas = data.sort((a, b) => 
        new Date(b.fecha + ' ' + b.hora).getTime() - new Date(a.fecha + ' ' + a.hora).getTime()
      );
      setCitas(ordenadas);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  }

  function filtrarCitas() {
    let resultado = [...citas];

    if (busqueda) {
      resultado = resultado.filter(c => 
        c.paciente.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.paciente.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.paciente.dni.includes(busqueda)
      );
    }

    if (estadoFiltro !== 'todas') {
      resultado = resultado.filter(c => c.estado === estadoFiltro);
    }

    setCitasFiltradas(resultado);
  }

  const getEstadoColor = (estado: CitaEstado) => {
    switch (estado) {
      case CitaEstado.PENDIENTE: return 'bg-yellow-100 text-yellow-700';
      case CitaEstado.CONFIRMADA: return 'bg-blue-100 text-blue-700';
      case CitaEstado.COMPLETADA: return 'bg-green-100 text-green-700';
      case CitaEstado.CANCELADA: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  async function verDetalleCita(cita: CitaResponse) {
  setCitaSeleccionada(cita);
  setLoadingDetalles(true);
  try {
    const detalles = await detalleCitaService.getByCita(cita.id);
    setDetallesCita(detalles);
  } catch (err) {
    console.error('Error:', err);
    toast.error("Error al cargar detalles de la cita");
    setDetallesCita([]);
  } finally {
    setLoadingDetalles(false);
  }
}

  if (authLoading || !isAuthenticated) return null;

  return (
    <div>
        <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Citas</h1>
          <p className="text-gray-600 mt-1">
            Administra las citas de los pacientes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Citas</p>
            <p className="text-2xl font-bold text-gray-800">{citas.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {citas.filter(c => c.estado === CitaEstado.PENDIENTE).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Confirmadas</p>
            <p className="text-2xl font-bold text-blue-600">
              {citas.filter(c => c.estado === CitaEstado.CONFIRMADA).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-green-600">
              {citas.filter(c => c.estado === CitaEstado.COMPLETADA).length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por paciente o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="todas">Todos los estados</option>
                <option value={CitaEstado.PENDIENTE}>Pendientes</option>
                <option value={CitaEstado.CONFIRMADA}>Confirmadas</option>
                <option value={CitaEstado.COMPLETADA}>Completadas</option>
                <option value={CitaEstado.CANCELADA}>Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de citas */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron citas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {citasFiltradas.map((cita) => (
              <div
                key={cita.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(cita.estado)}`}>
                        {cita.estado}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {cita.estadoPago}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cita.paciente.nombres} {cita.paciente.apellidos}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>📅 {formatDate(cita.fecha)}</span>
                      <span>🕐 {cita.hora}</span>
                      <span>📄 DNI: {cita.paciente.dni}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => verDetalleCita(cita)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {citaSeleccionada && (
  <Modal
    isOpen={!!citaSeleccionada}
    onClose={() => {
      setCitaSeleccionada(null);
      setDetallesCita([]);
    }}
    title="Detalle de Cita"
    subtitle={`${citaSeleccionada.paciente.nombres} ${citaSeleccionada.paciente.apellidos}`}
    icon={<Calendar className="w-6 h-6" />}
    size="xl"
  >
    {loadingDetalles ? (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    ) : (
      <div className="space-y-6">
        
        {/* Grid: Info Paciente + Info Cita */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Info del Paciente */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Paciente
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Nombre</p>
                <p className="font-semibold text-gray-800">
                  {citaSeleccionada.paciente.nombres} {citaSeleccionada.paciente.apellidos}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-600">DNI</p>
                  <p className="font-medium text-gray-800">{citaSeleccionada.paciente.dni}</p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-800">{citaSeleccionada.paciente.telefono}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info de la Cita */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Información de la Cita</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Fecha</p>
                <p className="font-semibold text-gray-800">{formatDate(citaSeleccionada.fecha)}</p>
              </div>
              <div>
                <p className="text-gray-600">Hora</p>
                <p className="font-semibold text-gray-800 text-lg">🕐 {citaSeleccionada.hora}</p>
              </div>
              <div>
                <p className="text-gray-600">Estado</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(citaSeleccionada.estado)}`}>
                  {citaSeleccionada.estado}
                </span>
              </div>
              <div>
                <p className="text-gray-600">Estado Pago</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  citaSeleccionada.estadoPago === 'pagado' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {citaSeleccionada.estadoPago}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Servicios Contratados */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Servicios Contratados
          </h3>
          
          {detallesCita.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No hay servicios registrados para esta cita</p>
            </div>
          ) : (
            <div className="space-y-3">
              {detallesCita.map((detalle) => (
                <div
                  key={detalle.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-purple-50 to-pink-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {detalle.servicio.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {detalle.servicio.descripcion}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-purple-600 font-medium">
                          ⏱️ {detalle.servicio.duracion} min
                        </span>
                        <span className="text-gray-600">
                          📋 {detalle.servicio.especialidad.nombre}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Precio</p>
                      <p className="text-2xl font-bold text-purple-600">
                        S/ {parseFloat(detalle.precioUnitario).toFixed(2)}
                      </p>
                      {detalle.esConMembresia && (
                        <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          Con Membresía
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Colaborador */}
                  <div className="border-t border-purple-200 pt-3 mt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Colaborador Asignado</p>
                        <p className="font-semibold text-gray-800">
                          {detalle.colaborador.nombres} {detalle.colaborador.apellidos}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Observaciones/Diagnóstico */}
                  {(detalle.observaciones || detalle.diagnostico || detalle.recomendaciones) && (
                    <div className="border-t border-purple-200 pt-3 mt-3 space-y-2">
                      {detalle.observaciones && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Observaciones:</p>
                          <p className="text-sm text-gray-600">{detalle.observaciones}</p>
                        </div>
                      )}
                      {detalle.diagnostico && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                          <p className="text-sm text-gray-600">{detalle.diagnostico}</p>
                        </div>
                      )}
                      {detalle.recomendaciones && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Recomendaciones:</p>
                          <p className="text-sm text-gray-600">{detalle.recomendaciones}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        {detallesCita.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Total de la Cita</span>
              <span className="text-3xl font-bold text-purple-600">
                S/ {detallesCita.reduce((sum, d) => sum + parseFloat(d.subtotal), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Botón cerrar */}
        <button
          onClick={() => {
            setCitaSeleccionada(null);
            setDetallesCita([]);
          }}
          className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Cerrar
        </button>
      </div>
    )}
  </Modal>
)}
    </div>
  );
}