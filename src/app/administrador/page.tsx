// app/administrador/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { 
  ventaProductoService, 
  registroGastoService,
  productoService, 
  citaService
} from "@/services/api";
import { 
  VentaProductoResponse, 
  RegistroGastoResponse,
  ProductoResponse, 
  CitaResponse
} from "@/types";
import ChatbotWidget from "@/components/domain/administrador/ChatbotWidget";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  Calendar,
  Package,
  Users,
  Loader2
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Link from "next/link";
import { esHoy, formatDate } from "@/lib/utils/date";

interface DashboardData {
  ventasMes: number;
  gastosMes: number;
  utilidadMes: number;
  citasHoy: CitaResponse[];
  productosStockBajo: number;
  ventasHoy: number;
  ventasSemana: VentaProductoResponse[];
  gastosSemana: RegistroGastoResponse[];
  productosAlerta: ProductoResponse[];
  topProductos: { nombre: string; cantidad: number; total: number }[];
}

export default function AdministradorDashboard() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    allowedRoles: ['administrador']
  });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    ventasMes: 0,
    gastosMes: 0,
    utilidadMes: 0,
    citasHoy: [],
    productosStockBajo: 0,
    ventasHoy: 0,
    ventasSemana: [],
    gastosSemana: [],
    productosAlerta: [],
    topProductos: []
  });

  useEffect(() => {
  if (isAuthenticated) {
    cargarDatos();
    
    const interval = setInterval(() => {
      cargarDatos();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }
}, [isAuthenticated]);

  async function cargarDatos() {
    try {
      const [ventas, gastos, productos, citas] = await Promise.all([
        ventaProductoService.getAll(),
        registroGastoService.getAll(),
        productoService.getAll(),
        citaService.getAll()
      ]);

      // Fechas
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const hace7Dias = new Date(hoy);
      hace7Dias.setDate(hace7Dias.getDate() - 7);

      // Ventas del mes
      const ventasMes = ventas
        .filter(v => new Date(v.fecha) >= inicioMes)
        .reduce((sum, v) => sum + v.total, 0);

      // Gastos del mes
      const gastosMes = gastos
        .filter(g => new Date(g.fecha) >= inicioMes)
        .reduce((sum, g) => sum + g.total, 0);

      // Ventas de hoy
      const hoyStr = hoy.toISOString().split('T')[0];
      const ventasHoy = ventas
        .filter(v => v.fecha === hoyStr)
        .reduce((sum, v) => sum + v.total, 0);

      // Ventas última semana
      const ventasSemana = ventas.filter(v => new Date(v.fecha) >= hace7Dias);
      const gastosSemana = gastos.filter(g => new Date(g.fecha) >= hace7Dias);

      // Productos con stock bajo
      const productosAlerta = productos.filter(p => 
        p.estado === 'activo' && p.stock <= p.stockMinimo
      );

      // Top productos vendidos (calcular desde detalles)
      const productosVendidos: Record<string, { nombre: string; cantidad: number; total: number }> = {};

      const citasDeHoy = citas
      .filter(c => esHoy(c.fecha))
      .sort((a, b) => a.hora.localeCompare(b.hora))
      .slice(0, 5);
      
      ventas.forEach(venta => {
        if (venta.detalles) {
          venta.detalles.forEach(detalle => {
            const id = detalle.producto.id;
            if (!productosVendidos[id]) {
              productosVendidos[id] = {
                nombre: detalle.producto.nombre,
                cantidad: 0,
                total: 0
              };
            }
            productosVendidos[id].cantidad += detalle.cantidad;
            productosVendidos[id].total += detalle.subtotal;
          });
        }
      });

      const topProductos = Object.values(productosVendidos)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

      setData({
        ventasMes,
        gastosMes,
        utilidadMes: ventasMes - gastosMes,
        citasHoy: citasDeHoy, 
        productosStockBajo: productosAlerta.length,
        ventasHoy,
        ventasSemana,
        gastosSemana,
        productosAlerta,
        topProductos
      });

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  // Preparar datos para gráfico de ventas vs gastos
  const chartData = (() => {
    const ultimos7Dias = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const ventasDia = data.ventasSemana
        .filter(v => v.fecha === fechaStr)
        .reduce((sum, v) => sum + v.total, 0);
      
      const gastosDia = data.gastosSemana
        .filter(g => g.fecha === fechaStr)
        .reduce((sum, g) => sum + g.total, 0);

      ultimos7Dias.push({
        fecha: fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
        ventas: ventasDia,
        gastos: gastosDia
      });
    }
    return ultimos7Dias;
  })();

  if (authLoading || !isAuthenticated) return null;

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
    );
  }

  return (
    <div>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Resumen general del spa</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última actualización</p>
            <p className="text-sm font-medium text-gray-700">
              {new Date().toLocaleString('es-PE', { 
                day: '2-digit', 
                month: 'long', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        {/* Layout: Stats + Chatbot */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left & Center: Main Content */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Ventas del Mes */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-70" />
                </div>
                <p className="text-sm opacity-90 mb-1">Ventas del Mes</p>
                <p className="text-3xl font-bold">S/ {data.ventasMes.toFixed(2)}</p>
                <p className="text-xs opacity-75 mt-2">Ingresos totales</p>
              </div>

              {/* Gastos del Mes */}
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <ShoppingCart className="w-5 h-5 opacity-70" />
                </div>
                <p className="text-sm opacity-90 mb-1">Gastos del Mes</p>
                <p className="text-3xl font-bold">S/ {data.gastosMes.toFixed(2)}</p>
                <p className="text-xs opacity-75 mt-2">Egresos totales</p>
              </div>

              {/* Utilidad del Mes */}
              <div className={`bg-gradient-to-br ${
                data.utilidadMes >= 0 
                  ? 'from-blue-500 to-cyan-600' 
                  : 'from-orange-500 to-red-600'
              } rounded-xl shadow-lg p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  {data.utilidadMes >= 0 ? (
                    <TrendingUp className="w-5 h-5 opacity-70" />
                  ) : (
                    <TrendingDown className="w-5 h-5 opacity-70" />
                  )}
                </div>
                <p className="text-sm opacity-90 mb-1">Utilidad del Mes</p>
                <p className="text-3xl font-bold">S/ {data.utilidadMes.toFixed(2)}</p>
                <p className="text-xs opacity-75 mt-2">
                  {data.utilidadMes >= 0 ? 'Ganancia neta' : 'Pérdida neta'}
                </p>
              </div>

              {/* Ventas Hoy */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Ventas Hoy</p>
                <p className="text-3xl font-bold text-gray-800">S/ {data.ventasHoy.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-2">Ingresos de hoy</p>
              </div>

              {/* Stock Bajo */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
                <p className="text-3xl font-bold text-gray-800">{data.productosStockBajo}</p>
                <p className="text-xs text-orange-600 mt-2">Requieren reposición</p>
              </div>

              {/* Citas Hoy */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Citas Hoy</p>
                <p className="text-3xl font-bold text-gray-800">{data.citasHoy.length}</p>
                <p className="text-xs text-gray-500 mt-2">Programadas</p>
              </div>

            </div>

            {/* Gráfico: Ventas vs Gastos */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Ventas vs Gastos - Últimos 7 días
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `S/ ${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Ventas"
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Gastos"
                    dot={{ fill: '#ef4444', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Próximas Citas de Hoy */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-600" />
                Citas de Hoy
              </h2>
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                {data.citasHoy.length} citas
              </span>
            </div>

            {data.citasHoy.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay citas programadas para hoy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.citasHoy.map((cita) => (
                  <div 
                    key={cita.id}
                    className="flex items-center gap-4 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100 hover:shadow-md transition"
                  >
                    {/* Hora */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <p className="text-lg font-bold text-cyan-600">{cita.hora}</p>
                    </div>
                    
                    {/* Separador */}
                    <div className="h-12 w-px bg-cyan-200"></div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {cita.paciente 
                          ? `${cita.paciente.nombres} ${cita.paciente.apellidos}`
                          : 'Paciente sin datos'
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(cita.fecha)}
                      </p>
                    </div>
                    
                    {/* Estado */}
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cita.estado === 'confirmada' 
                          ? 'bg-green-100 text-green-700'
                          : cita.estado === 'completada'
                          ? 'bg-blue-100 text-blue-700'
                          : cita.estado === 'cancelada'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {cita.estado}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Ver todas */}
                <Link
                  href="/administrador/citas"
                  className="block text-center py-2 text-cyan-600 hover:text-cyan-700 font-medium text-sm hover:bg-cyan-50 rounded-lg transition"
                >
                  Ver todas las citas →
                </Link>
              </div>
            )}
          </div>

            {/* Alertas */}
            {data.productosAlerta.length > 0 && (
              <div className="bg-orange-50 rounded-xl border-2 border-orange-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Productos con Stock Bajo
                  </h2>
                </div>
                <div className="space-y-2">
                  {data.productosAlerta.slice(0, 5).map(producto => (
                    <div 
                      key={producto.id}
                      className="flex items-center justify-between bg-white rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{producto.nombre}</p>
                        <p className="text-sm text-gray-500">{producto.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-600">
                          Stock: {producto.stock}
                        </p>
                        <p className="text-xs text-gray-500">
                          Mínimo: {producto.stockMinimo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Productos */}
            {data.topProductos.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  🏆 Top 5 Productos Más Vendidos
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topProductos} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis 
                      dataKey="nombre" 
                      type="category" 
                      width={150}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => `${value} unidades`}
                    />
                    <Bar 
                      dataKey="cantidad" 
                      fill="#06b6d4" 
                      radius={[0, 8, 8, 0]}
                      name="Cantidad Vendida"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>

          {/* Right: Chatbot */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <ChatbotWidget />
            </div>
          </div>

        </div>
      </div>
    </div>
    
  );
}