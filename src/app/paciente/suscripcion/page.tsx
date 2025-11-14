// app/paciente/suscripcion/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/lib/store/auth.store";
import { 
  membresiaService, 
  suscripcionService, 
  consumoBeneficioService 
} from "@/services/api";
import { 
  MembresiaResponse, 
  SuscripcionResponse, 
  ConsumoBeneficioResponse 
} from "@/types";
import { Crown, Sparkles, CheckCircle, Gift, Zap } from "lucide-react";
import { toast } from "sonner";
import PagoSuscripcionModal from "@/components/domain/suscripcion/PagoSuscripcionModal";
import Layout from "@/components/layouts/Layout";
import { formatDate } from "@/lib/utils/date";

export default function SuscripcionPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['paciente'] });
  const { obtenerDatosCompletos } = useAuthStore();
  
  const [idPaciente, setIdPaciente] = useState<string | null>(null);
  const [membresias, setMembresias] = useState<MembresiaResponse[]>([]);
  const [miSuscripcion, setMiSuscripcion] = useState<SuscripcionResponse | null>(null);
  const [consumoBeneficios, setConsumoBeneficios] = useState<ConsumoBeneficioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState<MembresiaResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      obtenerIdPaciente();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (idPaciente) {
      cargarDatos();
    }
  }, [idPaciente]);

  async function obtenerIdPaciente() {
    try {
      const datos = await obtenerDatosCompletos();
      if (datos?.id) {
        setIdPaciente(datos.id);
      }
    } catch (err) {
      console.error('Error obteniendo ID:', err);
      toast.error("Error al cargar perfil");
    }
  }

  async function cargarDatos() {
    if (!idPaciente) return;
    
    try {
      const [membresiasData, suscripcionesData] = await Promise.all([
        membresiaService.getActivas(),
        suscripcionService.getByPaciente(idPaciente),
      ]);
      
      setMembresias(membresiasData);
      const suscripcionActiva = suscripcionesData[0] || null;
      setMiSuscripcion(suscripcionActiva);

      // Si tiene suscripción, cargar sus beneficios
      if (suscripcionActiva) {
        const consumos = await consumoBeneficioService.getBySuscripcion(suscripcionActiva.id);
        setConsumoBeneficios(consumos);
      }
      
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
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

  return (
    <Layout>
        <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-500" />
          Mi Suscripción Premium
        </h1>
        <p className="text-gray-600 mt-2">
          {miSuscripcion 
            ? "Disfruta de todos los beneficios de tu membresía" 
            : "Elige el plan perfecto para ti"}
        </p>
      </div>

      {/* Si tiene suscripción activa */}
      {miSuscripcion ? (
        <div className="space-y-6">
          {/* Info de la suscripción */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{miSuscripcion.membresia.nombre}</h2>
                  <p className="text-sm text-gray-600">Membresía Activa</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                {miSuscripcion.estado}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Precio Mensual</p>
                <p className="text-2xl font-bold text-cyan-600">S/ {miSuscripcion.membresia.precio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha de Inicio</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(miSuscripcion.fechaInicio)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha de Vencimiento</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(miSuscripcion.fechaFin)}
                </p>
              </div>
            </div>
          </div>

          {/* Beneficios disponibles */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="w-6 h-6 text-cyan-600" />
              <h2 className="text-xl font-bold text-gray-800">Mis Beneficios</h2>
            </div>

            {consumoBeneficios.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay beneficios disponibles</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consumoBeneficios.map((beneficio) => {
                  const porcentajeUsado = (beneficio.cantidadConsumida / beneficio.cantidadTotal) * 100;
                  
                  return (
                    <div 
                      key={beneficio.id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 capitalize">
                            {beneficio.servicio.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">Servicio incluido</p>
                        </div>
                        <div className="bg-cyan-50 p-2 rounded-full">
                          <Zap className="w-5 h-5 text-cyan-600" />
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Disponibles</span>
                          <span className="font-semibold text-cyan-600">
                            {beneficio.cantidadDisponible} de {beneficio.cantidadTotal}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              beneficio.cantidadDisponible === 0 
                                ? 'bg-red-500' 
                                : beneficio.cantidadDisponible <= 1
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${100 - porcentajeUsado}%` }}
                          />
                        </div>

                        {beneficio.cantidadConsumida > 0 && (
                          <p className="text-xs text-gray-500">
                            Has usado {beneficio.cantidadConsumida} {beneficio.cantidadConsumida === 1 ? 'vez' : 'veces'}
                          </p>
                        )}
                      </div>

                      {beneficio.cantidadDisponible === 0 && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                          <p className="text-xs text-red-700 font-medium">
                            Beneficio agotado
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Si NO tiene suscripción - Mostrar planes */
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membresias.map((membresia, index) => (
              <div 
                key={membresia.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border-2 ${
                  index === 1 ? 'border-cyan-400 ring-2 ring-cyan-200' : 'border-gray-200'
                } relative`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{membresia.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-6 h-12">{membresia.descripcion}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-cyan-600">S/ {membresia.precio}</span>
                    <p className="text-sm text-gray-500 mt-2">{membresia.duracionDias} días de acceso</p>
                  </div>
                </div>

                <button
                  onClick={() => setMembresiaSeleccionada(membresia)}
                  className={`w-full py-3 rounded-lg font-semibold transition shadow-md ${
                    index === 1
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Seleccionar Plan
                </button>
              </div>
            ))}
          </div>

          {/* Beneficios generales */}
          <div className="mt-12 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Todos los planes incluyen:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Descuentos en tratamientos',
                'Prioridad en agendamiento',
                'Beneficios exclusivos',
                'Atención personalizada'
              ].map((beneficio, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{beneficio}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de pago */}
      {membresiaSeleccionada && idPaciente && (
        <PagoSuscripcionModal
          membresia={membresiaSeleccionada}
          idPaciente={idPaciente}
          onClose={() => setMembresiaSeleccionada(null)}
          onSuccess={() => {
            setMembresiaSeleccionada(null);
            cargarDatos();
          }}
        />
      )}
    </div>
    </Layout>
  );
}
