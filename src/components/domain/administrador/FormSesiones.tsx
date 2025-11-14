"use client";

import { useState, useEffect } from "react";
import { tratamientoService, sesionTratamientoService } from "@/services/api";
import { CrearSesionTratamientoDto, TratamientoResponse } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Loader2 } from "lucide-react";

interface FormSesionesProps {
  tratamientoId: string;
}

export default function FormSesiones({ tratamientoId }: FormSesionesProps) {
  const router = useRouter();
  
  const [tratamiento, setTratamiento] = useState<TratamientoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Estado de sesiones
  const [sesiones, setSesiones] = useState<CrearSesionTratamientoDto[]>([]);

  // Cargar tratamiento
  useEffect(() => {
    cargarTratamiento();
  }, [tratamientoId]);

  async function cargarTratamiento() {
    try {
      const data = await tratamientoService.getTratamientoById(tratamientoId);
      setTratamiento(data);
      
      // Inicializar array de sesiones vacías
      const sesionesVacias = Array.from({ length: data.sesionesTotales }, (_, i) => ({
        idTratamiento: tratamientoId,
        fecha: '',
        hora: '',
        observaciones: '',
      }));
      
      setSesiones(sesionesVacias);
    } catch (err) {
      toast.error("Error al cargar tratamiento");
      router.push("/administrador/tratamientos");
    } finally {
      setLoading(false);
    }
  }

  // Actualizar una sesión específica
  const actualizarSesion = (index: number, campo: keyof CrearSesionTratamientoDto, valor: string) => {
    const nuevasSesiones = [...sesiones];
    nuevasSesiones[index] = {
      ...nuevasSesiones[index],
      [campo]: valor,
    };
    setSesiones(nuevasSesiones);
  };

  // Validar y enviar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todas tengan fecha y hora
    const faltanDatos = sesiones.some(s => !s.fecha || !s.hora);
    if (faltanDatos) {
      toast.error("Todas las sesiones deben tener fecha y hora");
      return;
    }

    setGuardando(true);
    try {
      // Crear todas las sesiones
      const promesas = sesiones.map(sesion => 
        sesionTratamientoService.create(sesion)
      );
      
      await Promise.all(promesas);
      
      toast.success(`${sesiones.length} sesiones programadas ✅`);
      router.push("/administrador/tratamientos");
      
    } catch (error: any) {
      console.error('❌ Error:', error);
      toast.error(error.response?.data?.message || "Error al programar sesiones");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!tratamiento) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Programar Sesiones</h2>
        <p className="text-gray-600 mt-1">
          Tratamiento: <span className="font-semibold">{tratamiento.tratamiento}</span>
        </p>
        <p className="text-sm text-gray-500">
          Paciente: {tratamiento.paciente.nombres} {tratamiento.paciente.apellidos}
        </p>
        <p className="text-sm text-cyan-600 font-medium mt-2">
          Total de sesiones a programar: {tratamiento.sesionesTotales}
        </p>
      </div>

      {/* Lista de sesiones */}
      <div className="space-y-4">
        {sesiones.map((sesion, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">
              Sesión {index + 1}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha *
                </label>
                <input
                  type="date"
                  value={sesion.fecha}
                  onChange={(e) => actualizarSesion(index, 'fecha', e.target.value)}
                  min={tratamiento.fechaInicio}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora *
                </label>
                <input
                  type="time"
                  value={sesion.hora}
                  onChange={(e) => actualizarSesion(index, 'hora', e.target.value)}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Observaciones (opcional)
              </label>
              <textarea
                value={sesion.observaciones}
                onChange={(e) => actualizarSesion(index, 'observaciones', e.target.value)}
                rows={2}
                placeholder="Notas adicionales..."
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50"
        >
          {guardando ? "Guardando..." : `Programar ${sesiones.length} Sesiones`}
        </button>
      </div>
    </form>
  );
}