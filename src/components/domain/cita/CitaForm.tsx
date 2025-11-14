// components/domain/cita/CitaForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { citaService, detalleCitaService, suscripcionService, consumoBeneficioService, pagoCitaService } from "@/services/api";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useColaboradoresPorEspecialidad } from "@/hooks/useColaboradoresPorEspecialidad";
import { useServiciosPorEspecialidad } from "@/hooks/useServiciosPorEspecialidad";
import { CrearCitaDto, ConsumoBeneficioResponse, CrearDetalleCitaDto } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { Crown, CheckCircle } from "lucide-react";
import ModalOpcionesPago from "./ModalOpcionesPago";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';

interface ServicioConMembresia {
  idServicio: string;
  usarMembresia: boolean;
  beneficioDisponible: ConsumoBeneficioResponse | null;
}

export default function FormCita() {
    const router = useRouter();
  const { register, handleSubmit, reset } = useForm<CrearCitaDto>({
    defaultValues: {
      fecha: "",
      hora: "",
    },
  });

  const { usuario, obtenerDatosCompletos } = useAuthStore();

  // Estados básicos
  const [idEspecialidad, setIdEspecialidad] = useState<string>("");
  const [idColaborador, setIdColaborador] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Estados de membresía
  const [idPaciente, setIdPaciente] = useState<string | null>(null);
  const [tieneSuscripcion, setTieneSuscripcion] = useState(false);
  const [beneficiosDisponibles, setBeneficiosDisponibles] = useState<ConsumoBeneficioResponse[]>([]);

  // Estados de servicios
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioConMembresia[]>([]);

  // Estado para modal de pago
  const [datosPago, setDatosPago] = useState<{
    citaId: string;
    monto: number;
  } | null>(null);

  // Hooks
  const { especialidades } = useEspecialidades();
  const { colaboradores } = useColaboradoresPorEspecialidad(idEspecialidad);
  const { servicios } = useServiciosPorEspecialidad(idEspecialidad);

  // Cargar datos del paciente y beneficios al montar
  useEffect(() => {
    cargarDatosPaciente();
  }, []);

  async function cargarDatosPaciente() {
    try {
      const datos = await obtenerDatosCompletos();
      if (datos?.id) {
        setIdPaciente(datos.id);
        await verificarSuscripcion(datos.id);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }

  async function verificarSuscripcion(pacienteId: string) {
    try {
      const suscripciones = await suscripcionService.getByPaciente(pacienteId);
      const suscripcionActiva = suscripciones.find(s => s.estado === 'activa');

      if (suscripcionActiva) {
        setTieneSuscripcion(true);
        const beneficios = await consumoBeneficioService.getBySuscripcion(suscripcionActiva.id);
        setBeneficiosDisponibles(beneficios.filter(b => b.cantidadDisponible > 0));
      }
    } catch (err) {
      console.error('Error verificando suscripción:', err);
    }
  }

  // Agregar/quitar servicio
  function toggleServicio(idServicio: string) {
    setServiciosSeleccionados(prev => {
      const existe = prev.find(s => s.idServicio === idServicio);
      
      if (existe) {
        return prev.filter(s => s.idServicio !== idServicio);
      } else {
        // Buscar si tiene beneficio disponible para este servicio
        const beneficio = beneficiosDisponibles.find(b => b.servicio.id === idServicio);
        
        return [
          ...prev,
          {
            idServicio,
            usarMembresia: false,
            beneficioDisponible: beneficio || null,
          }
        ];
      }
    });
  }

  // Toggle membresía para un servicio
  function toggleMembresia(idServicio: string) {
    setServiciosSeleccionados(prev =>
      prev.map(s =>
        s.idServicio === idServicio
          ? { ...s, usarMembresia: !s.usarMembresia }
          : s
      )
    );
  }

  // Calcular totales
  const calcularTotales = () => {
    let totalConMembresia = 0;
    let totalSinMembresia = 0;

    serviciosSeleccionados.forEach(({ idServicio, usarMembresia }) => {
      const servicio = servicios.find(s => s.id === idServicio);
      if (servicio) {
        const precio = Number(servicio.precio);
        if (usarMembresia) {
          totalConMembresia += 0; // Gratis con membresía
        } else {
          totalSinMembresia += precio;
        }
      }
    });

    return {
      totalConMembresia,
      totalSinMembresia,
      totalGeneral: totalConMembresia + totalSinMembresia,
    };
  };

  const { totalSinMembresia } = calcularTotales();

  // Enviar formulario
 const onSubmit = async (data: CrearCitaDto) => {
  if (!idColaborador) {
    toast.error("Selecciona un especialista");
    return;
  }

  if (serviciosSeleccionados.length === 0) {
    toast.error("Selecciona al menos un servicio");
    return;
  }

  if (!idPaciente) {
    toast.error("No se encontró información del paciente");
    return;
  }

  if (!usuario?.correo) {
    toast.error("No se encontró tu correo electrónico");
    return;
  }

  setLoading(true);

  try {
    // 1. Crear cita
    const cita = await citaService.create({
      idPaciente,
      fecha: data.fecha,
      hora: data.hora,
    });

    console.log('✅ Cita creada:', cita.id);
    console.log('📋 Servicios seleccionados:', serviciosSeleccionados);

    // 2. Crear detalles con/sin membresía
    for (const { idServicio, usarMembresia, beneficioDisponible } of serviciosSeleccionados) {
  const detalleDto: any = {  // 🔥 Temporalmente any
    idCita: cita.id,
    idServicio,
    idColaborador,
  };

  // Solo agregar si usa membresía
  if (usarMembresia) {
    detalleDto.pagarConMembresia = true;
  }
  console.log('🚀 DTO FINAL QUE SE ENVIARÁ:', JSON.stringify(detalleDto, null, 2));

  console.log('📤 DTO que se va a enviar:', detalleDto);
  
  try {
    const resultado = await detalleCitaService.create(detalleDto);
    console.log('✅ Detalle creado:', resultado);
  } catch (err: any) {
    console.error('❌ Error creando detalle:', err.response?.data);
    throw err;
  }
}
  //  for (const { idServicio, usarMembresia, beneficioDisponible } of serviciosSeleccionados) {
  //     const detalleDto: CrearDetalleCitaDto = {
  //       idCita: cita.id,
  //       idServicio,
  //       idColaborador,
  //       pagarConMembresia: usarMembresia,
  //     };

  //     if (usarMembresia && beneficioDisponible?.id) {
  //       detalleDto.idConsumoBeneficio = beneficioDisponible.id;
  //     }

  //     // 🔥 LOG IMPORTANTE
  //     console.log('📤 Enviando detalle:', {
  //       servicio: idServicio,
  //       usarMembresia,
  //       beneficioId: beneficioDisponible?.id,
  //       detalleCompleto: detalleDto
  //     });

  //     await detalleCitaService.create(detalleDto);
  //   }

    console.log('✅ Detalles creados');

    // 3. Procesar pago según el monto
    if (totalSinMembresia === 0) {
      // 🔥 TODO es con membresía - procesar pago automáticamente
      try {
        await pagoCitaService.pagarConMembresia({
          idCita: cita.id,
          email: usuario.correo,
        });

        toast.success("¡Cita confirmada! Usaste tu membresía 🎉");
        
        // Confetti
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
        });

        // Limpiar y redirigir
        setTimeout(() => {
          limpiarFormulario();
          router.push('/paciente');
          router.refresh();
        }, 1500);

      } catch (err: any) {
        console.error('Error al confirmar pago con membresía:', err);
        toast.error(err.response?.data?.message || "Error al confirmar pago");
      }
      
    } else {
      // Hay que pagar con tarjeta/efectivo/yape
      toast.success("Cita registrada correctamente ✅");
      setDatosPago({
        citaId: cita.id,
        monto: totalSinMembresia,
      });
    }

  } catch (error: any) {
    console.error("Error:", error);
    toast.error(error.response?.data?.message || "Error al registrar la cita");
  } finally {
    setLoading(false);
  }
};

  function limpiarFormulario() {
    reset();
    setIdEspecialidad("");
    setServiciosSeleccionados([]);
    setIdColaborador("");
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Especialidad */}
        <div>
          <label className="block text-sm font-medium mb-1">Especialidad</label>
          <select
            className="border rounded-lg p-2 w-full"
            value={idEspecialidad}
            onChange={(e) => {
              setIdEspecialidad(e.target.value);
              setServiciosSeleccionados([]);
              setIdColaborador("");
            }}
            disabled={loading}
          >
            <option value="">Seleccione una especialidad</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Servicios */}
        {idEspecialidad && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Servicios ({serviciosSeleccionados.length} seleccionados)
            </label>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {servicios.map((serv) => {
                const seleccionado = serviciosSeleccionados.find(s => s.idServicio === serv.id);
                const beneficio = beneficiosDisponibles.find(b => b.servicio.id === serv.id);

                return (
                  <div
                    key={serv.id}
                    className={`border rounded-xl p-4 transition ${
                      seleccionado
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div
                      onClick={() => !loading && toggleServicio(serv.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{serv.nombre}</p>
                          <p className="text-sm text-gray-500">{serv.descripcion}</p>
                          <p className="mt-1 text-sm font-medium text-cyan-600">
                            S/. {serv.precio}
                          </p>
                        </div>
                        {seleccionado && (
                          <CheckCircle className="w-5 h-5 text-cyan-600" />
                        )}
                      </div>
                    </div>

                    {/* Toggle membresía */}
                    {seleccionado && beneficio && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium">
                              Tienes {beneficio.cantidadDisponible} disponibles
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleMembresia(serv.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                              seleccionado.usarMembresia
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {seleccionado.usarMembresia ? "✓ Usar membresía" : "Pagar normal"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Resumen */}
            {serviciosSeleccionados.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Con membresía:</span>
                  <span className="font-semibold text-green-600">
                    {serviciosSeleccionados.filter(s => s.usarMembresia).length} servicios
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>A pagar:</span>
                  <span className="font-semibold">
                    {serviciosSeleccionados.filter(s => !s.usarMembresia).length} servicios
                  </span>
                </div>
                <div className="pt-2 border-t flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-cyan-600">
                    S/. {totalSinMembresia.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fecha y hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              {...register("fecha", { required: true })}
              className="w-full border rounded-lg p-2"
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora</label>
            <input
              type="time"
              {...register("hora", { required: true })}
              className="w-full border rounded-lg p-2"
              disabled={loading}
            />
          </div>
        </div>

        {/* Colaborador */}
        {idEspecialidad && (
          <div>
            <label className="block text-sm font-medium mb-1">Especialista</label>
            <select
              className="border rounded-lg p-2 w-full"
              value={idColaborador}
              onChange={(e) => setIdColaborador(e.target.value)}
              disabled={!idEspecialidad || loading}
            >
              <option value="">Seleccione un colaborador</option>
              {colaboradores.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.nombres} {col.apellidos}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !idColaborador || serviciosSeleccionados.length === 0}
          className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? "Procesando..." : totalSinMembresia === 0 ? "Confirmar Cita" : "Continuar al Pago"}
        </button>
      </form>

      {/* Modal de opciones de pago */}
      {datosPago && (
        <ModalOpcionesPago
          citaId={datosPago.citaId}
          monto={datosPago.monto}
          onClose={() => {
            setDatosPago(null);
            limpiarFormulario();
          }}
          onSuccess={() => {
            setDatosPago(null);
            limpiarFormulario();
          }}
        />
      )}
    </>
  );
}