"use client";

import { useEffect, useState } from "react";
import { citaService } from "@/services/api";
import { CitaResponse } from "@/types";
import CitaCard from "./CitaCard";
import { Calendar, RefreshCw } from "lucide-react";

interface ListaCitasProps {
  limite?: number;
  mostrarBotonVerTodas?: boolean;
}

export default function ListaCitas({ 
  limite = 3, 
  mostrarBotonVerTodas = true 
}: ListaCitasProps) {
  const [citas, setCitas] = useState<CitaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cargarCitas() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await citaService.getMisCitas();
      setCitas(response.slice(0, limite));
      
    } catch (err: any) {
      setError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-10 w-10 border-4 border-cyan-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={cargarCitas} className="mt-4 text-cyan-600">
          Reintentar
        </button>
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No tienes citas programadas
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Tus Próximas Citas
      </h2>

      <div className="space-y-3">
        {citas.map((cita) => (
          <CitaCard key={cita.id} cita={cita} />
        ))}
      </div>

      {mostrarBotonVerTodas && (
        <button className="w-full py-3 text-cyan-600 hover:bg-cyan-50 rounded-lg">
          Ver todas →
        </button>
      )}
    </div>
  );
}