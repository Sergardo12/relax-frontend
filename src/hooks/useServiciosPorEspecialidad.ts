'use client';

import { useEffect, useState } from 'react';
import { ServicioResponse } from '@/types';
import { servicioService } from '@/services/api';


export function useServiciosPorEspecialidad(idEspecialidad?: string) {
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEspecialidad) return;

    const fetchServicios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await servicioService.obtenerServicioPorEspecialidad(idEspecialidad);
        setServicios(data);
      } catch (err) {
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [idEspecialidad]);

  return { servicios, loading, error };
}
