import { useEffect, useState } from 'react';
import { EspecialidadResponse } from '@/types';
import { especialidadService } from '@/services/api';


export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState<EspecialidadResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEspecialidades() {
      try {
        const data = await especialidadService.getEspecialidadesActivas();
        setEspecialidades(data);
      } catch (err) {
        setError('Error al cargar las especialidades');
      } finally {
        setLoading(false);
      }
    }

    fetchEspecialidades();
  }, []);

  return { especialidades, loading, error };
}
