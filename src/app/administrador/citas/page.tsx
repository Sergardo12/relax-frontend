// app/administrador/citas/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { citaService } from "@/services/api";
import { CitaResponse, CitaEstado } from "@/types";
import { Calendar, Search, Filter, Eye, Loader2 } from "lucide-react";
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
                    onClick={() => setCitaSeleccionada(cita)}
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

      {/* Modal de detalle */}
      {citaSeleccionada && (
        <Modal
          isOpen={!!citaSeleccionada}
          onClose={() => setCitaSeleccionada(null)}
          title="Detalle de Cita"
          subtitle={`Cita de ${citaSeleccionada.paciente.nombres} ${citaSeleccionada.paciente.apellidos}`}
          icon={<Calendar className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <p>Aquí irá el contenido del modal...</p>
            {/* Por ahora solo muestra info básica */}
          </div>
        </Modal>
      )}
    </div>
  );
}