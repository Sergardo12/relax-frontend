 // app/administrador/compras/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { compraProductoService } from "@/services/api";
import { CompraProductoResponse } from "@/types";
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Eye,
  Calendar,
  Loader2,
  FileText,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalNuevaCompra from "@/components/domain/administrador/ModalNuevaCompra";
import ModalDetalleCompra from "@/components/domain/administrador/ModalDetalleCompra";
import { esHoy } from "@/lib/utils/date";


export default function ComprasPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [compras, setCompras] = useState<CompraProductoResponse[]>([]);
  const [comprasFiltradas, setComprasFiltradas] = useState<CompraProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Modales
  const [modalNuevaCompra, setModalNuevaCompra] = useState(false);
  const [compraDetalle, setCompraDetalle] = useState<CompraProductoResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarCompras();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarCompras();
  }, [compras, busqueda]);

  async function cargarCompras() {
    try {
      const data = await compraProductoService.getAll();
      // Ordenar por fecha más reciente
      const ordenadas = data.sort((a, b) => 
        new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
      );
      setCompras(ordenadas);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar compras");
    } finally {
      setLoading(false);
    }
  }
  async function verDetalle(compraId: string) {
    try {
      setLoading(true);
      const compraCompleta = await compraProductoService.getById(compraId);
      setCompraDetalle(compraCompleta);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar detalle de la compra");
    } finally {
      setLoading(false);
    }
  }

  function filtrarCompras() {
    let resultado = [...compras];

    if (busqueda) {
      resultado = resultado.filter(c => 
        c.proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.numeroComprobante.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.proveedor.ruc.includes(busqueda)
      );
    }

    setComprasFiltradas(resultado);
  }

  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0);
  const comprasHoy = compras.filter(c => esHoy(c.fecha)).length;
  const totalHoy = compras
    .filter(c => esHoy(c.fecha))
    .reduce((sum, c) => sum + c.total, 0);

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
            <h1 className="text-3xl font-bold text-gray-800">Compras</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las compras de productos a proveedores
            </p>
          </div>
          <button
            onClick={() => setModalNuevaCompra(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Compra
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Compras</p>
                <p className="text-2xl font-bold text-gray-800">{compras.length}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compras Hoy</p>
                <p className="text-2xl font-bold text-cyan-600">{comprasHoy}</p>
              </div>
              <Calendar className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-green-600">S/ {totalCompras.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por proveedor, número de comprobante o RUC..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de compras */}
        {comprasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron compras</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comprasFiltradas.map((compra) => (
              <div
                key={compra.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {compra.proveedor.nombre}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {compra.estado}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{compra.tipoComprobante.toUpperCase()}: {compra.numeroComprobante}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(compra.fecha.split('T')[0] + 'T12:00:00').toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {compra.observaciones && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          {compra.observaciones}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        S/ {compra.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Botón ver detalle */}
                  <button
                    onClick={() => verDetalle(compra.id)}  
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
      {modalNuevaCompra && (
        <ModalNuevaCompra
          onClose={() => setModalNuevaCompra(false)}
          onSuccess={() => {
            cargarCompras();
            setModalNuevaCompra(false);
          }}
        />
      )}

      {compraDetalle && (
        <ModalDetalleCompra
          compra={compraDetalle}
          onClose={() => setCompraDetalle(null)}
        />
      )}
    </div>
    
  );
}