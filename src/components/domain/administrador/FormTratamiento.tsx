"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { tratamientoService, pacienteService } from "@/services/api";
import { CrearTratamientoDto } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { CheckCircle, Loader2 } from "lucide-react";

export default function FormTratamiento() {
  const { register, handleSubmit, reset } = useForm<CrearTratamientoDto>();
  const router = useRouter();
  const { usuario } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [idColaboradorActual, setIdColaboradorActual] = useState("");
  
  // Búsqueda de paciente
  const [dni, setDni] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [paciente, setPaciente] = useState<any>(null);

  // Cargar colaborador al montar
  useEffect(() => {
    useAuthStore.getState().obtenerDatosCompletos().then(datos => {
      if (datos?.id) setIdColaboradorActual(datos.id);
    });
  }, []);

  //  Buscar automáticamente cuando DNI tenga 8 dígitos
  useEffect(() => {
    if (dni.length === 8) {
      buscarPaciente();
    } else {
      setPaciente(null);
    }
  }, [dni]);

  async function buscarPaciente() {
  setBuscando(true);
  console.log('🔍 Buscando DNI:', dni);
  
  try {
    const response = await pacienteService.listarPacientes();
    console.log('📦 Response completo:', response); // 🔥 Ver qué devuelve
    console.log('📦 Tipo de response:', typeof response); // 🔥 Ver el tipo
    console.log('📦 Es array?:', Array.isArray(response)); // 🔥 Ver si es array
    
    // Validar que sea un array
    if (!response || !Array.isArray(response)) {
      console.error('❌ Response no es un array:', response);
      toast.error("Error: respuesta inválida del servidor");
      setPaciente(null);
      return;
    }
    
    console.log('✅ Pacientes obtenidos:', response.length);
    console.log('📋 Primer paciente:', response[0]);
    
    const encontrado = response.find(p => p.dni === dni);
    console.log('🎯 Paciente encontrado:', encontrado);
    
    if (encontrado) {
      setPaciente(encontrado);
      toast.success(`✓ ${encontrado.nombres} ${encontrado.apellidos}`);
    } else {
      setPaciente(null);
      toast.error("Paciente no encontrado");
    }
  } catch (err) {
    console.error('❌ Error completo:', err);
    toast.error("Error al buscar");
    setPaciente(null);
  } finally {
    setBuscando(false);
  }
}

  const onSubmit = async (data: CrearTratamientoDto) => {
  if (!paciente) {
    toast.error("Ingrese un DNI válido");
    return;
  }

  if (!idColaboradorActual) {
    toast.error("No se pudo identificar al colaborador");
    return;
  }

  const payload = {
    ...data,
    idPaciente: paciente.id,
    idColaborador: idColaboradorActual,
    sesionesTotales: Number(data.sesionesTotales),
    precioTotal: Number(data.precioTotal),
    pulso: data.pulso ? Number(data.pulso) : undefined,
    temperatura: data.temperatura ? Number(data.temperatura) : undefined,
    peso: data.peso ? Number(data.peso) : undefined,
    saturacion: data.saturacion ? Number(data.saturacion) : undefined,
  };

  setLoading(true);
  try {
    const tratamientoCreado = await tratamientoService.create(payload); // 🔥 Guarda respuesta
    
    console.log('✅ Tratamiento creado:', tratamientoCreado);
    
    toast.success("Tratamiento creado ✅. Ahora programa las sesiones.");
    
    // 🔥 Redirigir a programar sesiones
    router.push(`/administrador/tratamientos/${tratamientoCreado.id}/sesiones`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data);
    toast.error(error.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Crear Tratamiento</h2>

      {/* DNI con búsqueda automática */}
      <div>
        <label className="block text-sm font-semibold mb-2">DNI del Paciente *</label>
        <div className="relative">
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Ingrese DNI (8 dígitos)"
            className="w-full border rounded-lg p-3 pr-10 focus:ring-2 focus:ring-cyan-500"
          />
          {buscando && (
            <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-cyan-600" />
          )}
        </div>

        {/* Paciente encontrado */}
        {paciente && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold">{paciente.nombres} {paciente.apellidos}</p>
              <p className="text-sm text-gray-600">DNI: {paciente.dni}</p>
            </div>
          </div>
        )}
      </div>

      {/* Fecha y Sesiones */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Inicio *</label>
          <input 
            type="date" 
            {...register("fechaInicio", { required: true })} 
            min={new Date().toISOString().split('T')[0]}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sesiones *</label>
          <input 
            type="number" 
            min="1"
            {...register("sesionesTotales", { required: true })} 
            placeholder="5"
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      {/* Diagnóstico */}
      <div>
        <label className="block text-sm font-medium mb-1">Diagnóstico *</label>
        <textarea 
          {...register("diagnostico", { required: true })} 
          rows={3} 
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Tratamiento */}
      <div>
        <label className="block text-sm font-medium mb-1">Tratamiento *</label>
        <textarea 
          {...register("tratamiento", { required: true })} 
          rows={3} 
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Signos vitales (colapsable) */}
      <details className="bg-gray-50 p-4 rounded-lg">
        <summary className="cursor-pointer font-medium">Signos Vitales (Opcional)</summary>
        <div className="grid grid-cols-5 gap-3 mt-3">
          <div>
            <label className="block text-xs mb-1">Presión</label>
            <input {...register("presionArterial")} placeholder="120/80" className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs mb-1">Pulso</label>
            <input type="number" {...register("pulso")} className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs mb-1">Temp.</label>
            <input type="number" step="0.1" {...register("temperatura")} className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs mb-1">Peso</label>
            <input type="number" step="0.1" {...register("peso")} className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs mb-1">Sat.</label>
            <input type="number" {...register("saturacion")} className="w-full border rounded p-2 text-sm" />
          </div>
        </div>
      </details>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium mb-1">Precio Total (S/) *</label>
        <input 
          type="number" 
          step="0.01"
          {...register("precioTotal", { required: true })} 
          placeholder="300.00"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Botón */}
      <button 
        type="submit" 
        disabled={loading || !paciente}
        className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear Tratamiento"}
      </button>
    </form>
  );
}