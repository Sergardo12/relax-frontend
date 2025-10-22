import { useEffect, useState } from 'react';
import { ColaboradorResponse } from '@/types';
import { colaboradorService } from '@/services/api';


export function useColaboradoresPorEspecialidad(idEspecialidad?: string) {
  const [colaboradores, setColaboradores] = useState<ColaboradorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEspecialidad) return;

    async function fetchColaboradores() {
      setLoading(true);
      try {
        const data = await colaboradorService.listarColaboradores();
        const filtrados = data.filter(
          (col) => col.especialidad.id === idEspecialidad
        );
        setColaboradores(filtrados);
      } catch (err) {
        setError('Error al cargar los colaboradores');
      } finally {
        setLoading(false);
      }
    }

    fetchColaboradores();
  }, [idEspecialidad]);

  return { colaboradores, loading, error };
}
