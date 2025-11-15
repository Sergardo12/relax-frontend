// app/administrador/gastos/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { registroGastoService } from "@/services/api";
import { RegistroGastoResponse, CategoriaGasto } from "@/types";
import { 
  Receipt, 
  Plus, 
  Search, 
  Eye,
  Calendar,
  Loader2,
  FileText,
  DollarSign,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalNuevoGasto from "@/components/domain/administrador/ModalNuevoGasto";
import ModalDetalleGasto from "@/components/domain/administrador/ModalDetalleGasto";
import { esHoy } from "@/lib/utils/date";


export default function GastosPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [gastos, setGastos] = useState<RegistroGastoResponse[]>([]);
  const [gastosFiltrados, setGastosFiltrados] = useState<RegistroGastoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  
  // Modales
  const [modalNuevoGasto, setModalNuevoGasto] = useState(false);
  const [gastoDetalle, setGastoDetalle] = useState<RegistroGastoResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarGastos();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarGastos();
  }, [gastos, busqueda, categoriaFiltro]);

  async function cargarGastos() {
    try {
      const data = await registroGastoService.getAll();
      const ordenados = data.sort((a, b) => 
        new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
      );
      setGastos(ordenados);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar gastos");
    } finally {
      setLoading(false);
    }
  }

  function filtrarGastos() {
    let resultado = [...gastos];

    if (busqueda) {
      resultado = resultado.filter(g => 
        g.proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        g.numeroComprobante.toLowerCase().includes(busqueda.toLowerCase()) ||
        g.proveedor.ruc.includes(busqueda)
      );
    }

    if (categoriaFiltro !== 'todas') {
      resultado = resultado.filter(g => g.categoria === categoriaFiltro);
    }

    setGastosFiltrados(resultado);
  }

  async function verDetalle(gastoId: string) {
    try {
      setLoading(true);
      const gastoCompleto = await registroGastoService.getById(gastoId);
      setGastoDetalle(gastoCompleto);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar detalle del gasto");
    } finally {
      setLoading(false);
    }
  }

  const totalGastos = gastos.reduce((sum, g) => sum + g.total, 0);
  const gastosHoy = gastos.filter(g => esHoy(g.fecha)).length;
  const totalHoy = gastos
    .filter(g => esHoy(g.fecha))
    .reduce((sum, g) => sum + g.total, 0);

  const categoriasLabels: Record<string, string> = {
    'productos_limpieza': 'Productos de Limpieza',
    'insumos_masaje': 'Insumos de Masaje',
    'servicios_basicos': 'Servicios Básicos',
    'mantenimiento': 'Mantenimiento',
    'otros': 'Otros'
  };

  if (authLoading || !isAuthenticated) return null;

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Registro de Gastos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los gastos operativos del spa
            </p>
          </div>
          <button
            onClick={() => setModalNuevoGasto(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Gasto
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gastos</p>
                <p className="text-2xl font-bold text-gray-800">{gastos.length}</p>
              </div>
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gastos Hoy</p>
                <p className="text-2xl font-bold text-cyan-600">{gastosHoy}</p>
              </div>
              <Calendar className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hoy</p>
                <p className="text-2xl font-bold text-red-600">S/ {totalHoy.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total General</p>
                <p className="text-2xl font-bold text-purple-600">S/ {totalGastos.toFixed(2)}</p>
              </div>
              <Receipt className="w-10 h-10 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Búsqueda */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por proveedor, número de comprobante o RUC..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de categoría */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
              >
                <option value="todas">Todas las categorías</option>
                {Object.entries(categoriasLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de gastos */}
        {gastosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron gastos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gastosFiltrados.map((gasto) => (
              <div
                key={gasto.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {gasto.proveedor.nombre}
                        </h3>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full capitalize">
                          {categoriasLabels[gasto.categoria] || gasto.categoria}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{gasto.tipoComprobante.toUpperCase()}: {gasto.numeroComprobante}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(gasto.fecha.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Receipt className="w-4 h-4" />
                          <span>{gasto.estado}</span>
                        </div>
                      </div>

                      {gasto.observaciones && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          {gasto.observaciones}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-red-600">
                        S/ {gasto.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Botón ver detalle */}
                  <button
                    onClick={() => verDetalle(gasto.id)}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Ver Detalle Completo
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalNuevoGasto && (
        <ModalNuevoGasto
          onClose={() => setModalNuevoGasto(false)}
          onSuccess={() => {
            cargarGastos();
            setModalNuevoGasto(false);
          }}
        />
      )}

      {gastoDetalle && (
        <ModalDetalleGasto
          gasto={gastoDetalle}
          onClose={() => setGastoDetalle(null)}
        />
      )}
    </div>
    
  );
}