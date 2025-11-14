"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Link from "next/link";
import { Plus, Calendar, User, DollarSign, Activity, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { tratamientoService } from "@/services/api";
import { TratamientoResponse } from "@/types";
import { formatYearDropdown } from "react-day-picker";
import { formatDate } from "@/lib/utils/date";

export default function TratamientosPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [tratamientos, setTratamientos] = useState<TratamientoResponse[]>([]);
  const [tratamientosFiltrados, setTratamientosFiltrados] = useState<TratamientoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dniBusqueda, setDniBusqueda] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      cargarTratamientos();
    }
  }, [isAuthenticated]);

  // Filtrar por DNI
  useEffect(() => {
  console.log('🔍 Buscando DNI:', dniBusqueda); // 🔥 DEBUG
  console.log('📋 Tratamientos totales:', tratamientos.length); // 🔥 DEBUG
  
  if (dniBusqueda.trim() === "") {
    setTratamientosFiltrados(tratamientos);
  } else {
    // 🔥 Ver qué DNIs hay
    console.log('📋 DNIs en tratamientos:', tratamientos.map(t => t.paciente.dni));
    
    const filtrados = tratamientos.filter(t => {
      const coincide = t.paciente.dni?.includes(dniBusqueda);
      console.log(`  - DNI: ${t.paciente.dni}, Coincide: ${coincide}`); // 🔥 DEBUG
      return coincide;
    });
    
    console.log('✅ Filtrados:', filtrados.length); // 🔥 DEBUG
    setTratamientosFiltrados(filtrados);
  }
}, [dniBusqueda, tratamientos]);

  async function cargarTratamientos() {
    try {
      const response = await tratamientoService.getAll();
      setTratamientos(response);
      setTratamientosFiltrados(response);
    } catch (err: any) {
      console.error('❌ Error al cargar tratamientos:', err);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !isAuthenticated) return null;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-cyan-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tratamientos</h1>
          <p className="text-gray-600 text-sm">
            {dniBusqueda ? `${tratamientosFiltrados.length} resultados` : `Total: ${tratamientos.length}`}
          </p>
        </div>
        <Link 
          href="/administrador/tratamientos/nuevo" 
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo Tratamiento
        </Link>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={dniBusqueda}
            onChange={(e) => setDniBusqueda(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Buscar por DNI del paciente..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Lista */}
      {tratamientosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-500">
            {dniBusqueda ? "No se encontraron tratamientos con ese DNI" : "No hay tratamientos registrados"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tratamientosFiltrados.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {t.paciente.nombres} {t.paciente.apellidos}
                  </p>
                  <p className="text-xs text-gray-500">DNI: {t.paciente.dni}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-medium">Diagnóstico:</p>
                <p className="text-sm text-gray-700 line-clamp-2">{t.diagnostico}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>{t.sesionesRealizadas}/{t.sesionesTotales} sesiones</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>S/. {t.precioTotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(t.fechaInicio)}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  t.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' :
                  t.estado === 'COMPLETADO' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {t.estado}
                </span>
              </div>

              <Link 
                href={`/administrador/tratamientos/${t.id}`}
                className="mt-3 block text-center text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Ver detalles →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}