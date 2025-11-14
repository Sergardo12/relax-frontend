// app/administrador/productos/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { productoService } from "@/services/api";
import { ProductoResponse, CategoriaProducto } from "@/types";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Filter,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import ModalProducto from "@/components/domain/administrador/ModalProducto";
import ModalAjustarStock from "@/components/domain/administrador/ModalAjustarStock";


export default function ProductosPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<ProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [soloStockBajo, setSoloStockBajo] = useState(false);
  
  // Modales
  const [modalCrear, setModalCrear] = useState(false);
  const [productoEditar, setProductoEditar] = useState<ProductoResponse | null>(null);
  const [productoAjustar, setProductoAjustar] = useState<ProductoResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarProductos();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarProductos();
  }, [productos, busqueda, categoriaFiltro, soloStockBajo]);

  async function cargarProductos() {
    try {
      const data = await productoService.getAll();
      setProductos(data);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  function filtrarProductos() {
    let resultado = [...productos];

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoriaFiltro !== 'todas') {
      resultado = resultado.filter(p => p.categoria === categoriaFiltro);
    }

    // Filtrar solo stock bajo
    if (soloStockBajo) {
      resultado = resultado.filter(p => p.stock <= p.stockMinimo);
    }

    setProductosFiltrados(resultado);
  }

  async function eliminarProducto(id: string) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productoService.delete(id);
      toast.success('Producto eliminado');
      cargarProductos();
    } catch (err) {
      toast.error('Error al eliminar producto');
    }
  }

  const productosStockBajo = productos.filter(p => p.stock <= p.stockMinimo).length;

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
            <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona el inventario de productos del spa
            </p>
          </div>
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>

        {/* Alerta de stock bajo */}
        {productosStockBajo > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">
                  {productosStockBajo} producto(s) con stock bajo
                </p>
                <button
                  onClick={() => setSoloStockBajo(!soloStockBajo)}
                  className="text-sm text-yellow-700 hover:text-yellow-800 underline"
                >
                  {soloStockBajo ? 'Ver todos' : 'Ver productos con stock bajo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
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
                {Object.values(CategoriaProducto).map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Total productos */}
            <div className="flex items-center justify-center bg-cyan-50 rounded-lg px-4 py-2">
              <Package className="w-5 h-5 text-cyan-600 mr-2" />
              <span className="font-semibold text-gray-800">
                {productosFiltrados.length} productos
              </span>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productosFiltrados.map((producto) => {
              const stockBajo = producto.stock <= producto.stockMinimo;
              const margen = ((producto.precioVenta - producto.precioCosto) / producto.precioCosto * 100).toFixed(1);

              return (
                <div
                  key={producto.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* Header */}
                  <div className={`p-4 ${stockBajo ? 'bg-red-50' : 'bg-gradient-to-r from-cyan-50 to-blue-50'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {producto.categoria}
                        </p>
                      </div>
                      {stockBajo && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {producto.descripcion || 'Sin descripción'}
                    </p>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 space-y-3">
                    {/* Stock */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Stock</span>
                        <span className={`font-semibold ${stockBajo ? 'text-red-600' : 'text-gray-800'}`}>
                          {producto.stock} unidades
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            stockBajo ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((producto.stock / (producto.stockMinimo * 3)) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Mínimo: {producto.stockMinimo}
                      </p>
                    </div>

                    {/* Precios */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">Costo</p>
                        <p className="font-semibold text-gray-800">S/ {producto.precioCosto}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">Venta</p>
                        <p className="font-semibold text-cyan-600">S/ {producto.precioVenta}</p>
                      </div>
                    </div>
                    <div className={`text-center py-1 rounded-lg ${
                        parseFloat(margen) < 0 
                            ? 'bg-red-50' 
                            : 'bg-green-50'
                        }`}>
                        <p className={`text-xs ${
                            parseFloat(margen) < 0 
                            ? 'text-red-700' 
                            : 'text-green-700'
                        }`}>
                            Margen: <span className="font-semibold">{margen}%</span>
                        </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="border-t border-gray-100 p-3 flex gap-2">
                    <button
                      onClick={() => setProductoAjustar(producto)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Package className="w-4 h-4" />
                      Ajustar
                    </button>
                    <button
                      onClick={() => setProductoEditar(producto)}
                      className="flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      className="flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalCrear && (
        <ModalProducto
          onClose={() => setModalCrear(false)}
          onSuccess={() => {
            cargarProductos();
            setModalCrear(false);
          }}
        />
      )}

      {productoEditar && (
        <ModalProducto
          producto={productoEditar}
          onClose={() => setProductoEditar(null)}
          onSuccess={() => {
            cargarProductos();
            setProductoEditar(null);
          }}
        />
      )}

      {productoAjustar && (
        <ModalAjustarStock
          producto={productoAjustar}
          onClose={() => setProductoAjustar(null)}
          onSuccess={() => {
            cargarProductos();
            setProductoAjustar(null);
          }}
        />
      )}
    </div>
  );
}