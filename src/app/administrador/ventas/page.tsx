// app/administrador/ventas/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ventaProductoService } from "@/services/api";
import { VentaProductoResponse } from "@/types";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye,
  Calendar,
  Loader2,
  FileText,
  DollarSign,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalNuevaVenta from "@/components/domain/administrador/ModalNuevaVenta";
import ModalDetalleVenta from "@/components/domain/administrador/ModalDetalleVenta";
import { esHoy, formatDate, getHoyString } from "@/lib/utils/date";


export default function VentasPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [ventas, setVentas] = useState<VentaProductoResponse[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<VentaProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Modales
  const [modalNuevaVenta, setModalNuevaVenta] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState<VentaProductoResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarVentas();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarVentas();
  }, [ventas, busqueda]);

  async function cargarVentas() {
    try {
      const data = await ventaProductoService.getAll();
      // Ordenar por fecha más reciente
      const ordenadas = data.sort((a, b) => 
        new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
      );
      setVentas(ordenadas);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  }

  function filtrarVentas() {
    let resultado = [...ventas];

    if (busqueda) {
      resultado = resultado.filter(v => 
        v.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.clienteDocumento?.includes(busqueda)
      );
    }

    setVentasFiltradas(resultado);
  }

  async function verDetalle(ventaId: string) {
    try {
      setLoading(true);
      const ventaCompleta = await ventaProductoService.getById(ventaId);
      setVentaDetalle(ventaCompleta);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar detalle de la venta");
    } finally {
      setLoading(false);
    }
  }

  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    console.log('🔍 Fecha de hoy (helper):', getHoyString());
    console.log('🔍 Total ventas:', ventas.length);
    console.log('🔍 Fechas de ventas:', ventas.map(v => v.fecha));
    console.log('🔍 Ventas filtradas hoy:', ventas.filter(v => esHoy(v.fecha)));

    const ventasHoy = ventas.filter(v => esHoy(v.fecha)).length;
    const totalHoy = ventas
      .filter(v => esHoy(v.fecha))
      .reduce((sum, v) => sum + v.total, 0);

    console.log('🔍 Ventas hoy (count):', ventasHoy);
    console.log('🔍 Total hoy:', totalHoy);

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
            <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las ventas de productos del spa
            </p>
          </div>
          <button
            onClick={() => setModalNuevaVenta(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Venta
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-800">{ventas.length}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas Hoy</p>
                <p className="text-2xl font-bold text-cyan-600">{ventasHoy}</p>
              </div>
              <Calendar className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Hoy</p>
                <p className="text-2xl font-bold text-green-600">S/ {totalHoy.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ingresos</p>
                <p className="text-2xl font-bold text-purple-600">S/ {totalVentas.toFixed(2)}</p>
              </div>
              <CreditCard className="w-10 h-10 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de comprobante, cliente o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de ventas */}
        {ventasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron ventas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ventasFiltradas.map((venta) => (
              <div
                key={venta.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {venta.clienteNombre || 'Cliente General'}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {venta.estado}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(venta.fecha)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          <span className="capitalize">{venta.metodoPago}</span>
                        </div>
                      </div>

                      {venta.clienteDocumento && (
                        <p className="text-sm text-gray-500 mt-2">
                          Doc: {venta.clienteDocumento}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        S/ {venta.total.toFixed(2)}
                      </p>
                      {venta.descuento > 0 && (
                        <p className="text-xs text-gray-500">
                          Desc: S/ {venta.descuento.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botón ver detalle */}
                  <button
                    onClick={() => verDetalle(venta.id)}
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
      {modalNuevaVenta && (
        <ModalNuevaVenta
          onClose={() => setModalNuevaVenta(false)}
          onSuccess={() => {
            cargarVentas();
            setModalNuevaVenta(false);
          }}
        />
      )}

      {ventaDetalle && (
        <ModalDetalleVenta
          venta={ventaDetalle}
          onClose={() => setVentaDetalle(null)}
        />
      )}
    </div>
    
  );
}