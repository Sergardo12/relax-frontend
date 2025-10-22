// ==================== PACIENTE STORE ====================

import { create } from 'zustand';
import { Paciente } from '@/types';

interface PacienteState {
  // Estado
  pacientes: Paciente[];
  currentPaciente: Paciente | null;
  loading: boolean;
  error: string | null;

  // Actions
  set: (pacientes: Paciente[]) => void;
  add: (paciente: Paciente) => void;
  update: (id: string, paciente: Partial<Paciente>) => void;
  remove: (id: string) => void;
  setCurrent: (paciente: Paciente | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  pacientes: [],
  currentPaciente: null,
  loading: false,
  error: null,
};

export const usePacienteStore = create<PacienteState>((set) => ({
  ...initialState,

  set: (pacientes) =>
    set({
      pacientes,
      error: null,
    }),

  add: (paciente) =>
    set((state) => ({
      pacientes: [...state.pacientes, paciente],
      error: null,
    })),

  update: (id, updatedPaciente) =>
    set((state) => ({
      pacientes: state.pacientes.map((p) =>
        p.id === id ? { ...p, ...updatedPaciente } : p
      ),
      currentPaciente:
        state.currentPaciente?.id === id
          ? { ...state.currentPaciente, ...updatedPaciente }
          : state.currentPaciente,
      error: null,
    })),

  remove: (id) =>
    set((state) => ({
      pacientes: state.pacientes.filter((p) => p.id !== id),
      currentPaciente: state.currentPaciente?.id === id ? null : state.currentPaciente,
      error: null,
    })),

  setCurrent: (paciente) =>
    set({
      currentPaciente: paciente,
      error: null,
    }),

  setError: (error) => set({ error, loading: false }),

  setLoading: (loading) => set({ loading }),

  reset: () => set(initialState),
}));
