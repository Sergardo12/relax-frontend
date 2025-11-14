// app/administrador/proveedores/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { proveedorService } from "@/services/api";
import { ProveedorResponse } from "@/types";
import { 
  Truck, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalProveedor from "@/components/domain/administrador/ModalProveedor";


export default function ProveedoresPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [proveedores, setProveedores] = useState<ProveedorResponse[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<ProveedorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
  
  // Modales
  const [modalCrear, setModalCrear] = useState(false);
  const [proveedorEditar, setProveedorEditar] = useState<ProveedorResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarProveedores();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarProveedores();
  }, [proveedores, busqueda, estadoFiltro]);

  async function cargarProveedores() {
    try {
      const data = await proveedorService.getAll();
      setProveedores(data);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  }

  function filtrarProveedores() {
    let resultado = [...proveedores];

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.ruc.includes(busqueda) ||
        p.telefono.includes(busqueda) ||
        p.email?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por estado
    if (estadoFiltro !== 'todos') {
      resultado = resultado.filter(p => p.estado === estadoFiltro);
    }

    setProveedoresFiltrados(resultado);
  }

  async function eliminarProveedor(id: string) {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;

    try {
      await proveedorService.delete(id);
      toast.success('Proveedor eliminado');
      cargarProveedores();
    } catch (err) {
      toast.error('Error al eliminar proveedor');
    }
  }

  const proveedoresActivos = proveedores.filter(p => p.estado === 'activo').length;
  const proveedoresInactivos = proveedores.filter(p => p.estado === 'inactivo').length;

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
            <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los proveedores de productos del spa
            </p>
          </div>
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Proveedor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">{proveedores.length}</p>
              </div>
              <Truck className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">{proveedoresActivos}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{proveedoresInactivos}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">✗</span>
              </div>
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
                placeholder="Buscar por nombre, RUC, teléfono o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de estado */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Lista de proveedores */}
        {proveedoresFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron proveedores</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proveedoresFiltrados.map((proveedor) => (
              <div
                key={proveedor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {/* Header */}
                <div className={`p-4 ${
                  proveedor.estado === 'activo'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {proveedor.nombre}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          proveedor.estado === 'activo'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {proveedor.estado}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">RUC: {proveedor.ruc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  {/* Teléfono */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm font-medium text-gray-800">{proveedor.telefono}</p>
                    </div>
                  </div>

                  {/* Email */}
                  {proveedor.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{proveedor.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Dirección */}
                  {proveedor.direccion && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Dirección</p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{proveedor.direccion}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="border-t border-gray-100 p-3 flex gap-2">
                  <button
                    onClick={() => setProveedorEditar(proveedor)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProveedor(proveedor.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalCrear && (
        <ModalProveedor
          onClose={() => setModalCrear(false)}
          onSuccess={() => {
            cargarProveedores();
            setModalCrear(false);
          }}
        />
      )}

      {proveedorEditar && (
        <ModalProveedor
          proveedor={proveedorEditar}
          onClose={() => setProveedorEditar(null)}
          onSuccess={() => {
            cargarProveedores();
            setProveedorEditar(null);
          }}
        />
      )}
    </div>
     
  );
}