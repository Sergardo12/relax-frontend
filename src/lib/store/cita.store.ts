// ==================== CITA STORE ====================

import { create } from 'zustand';
import { Cita } from '@/types';

interface CitaState {
  // Estado
  citas: Cita[];
  currentCita: Cita | null;
  loading: boolean;
  error: string | null;

  // Actions
  set: (citas: Cita[]) => void;
  add: (cita: Cita) => void;
  update: (id: string, cita: Partial<Cita>) => void;
  remove: (id: string) => void;
  setCurrent: (cita: Cita | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  citas: [],
  currentCita: null,
  loading: false,
  error: null,
};

export const useCitaStore = create<CitaState>((set) => ({
  ...initialState,

  set: (citas) =>
    set({
      citas,
      error: null,
    }),

  add: (cita) =>
    set((state) => ({
      citas: [...state.citas, cita],
      error: null,
    })),

  update: (id, updatedCita) =>
    set((state) => ({
      citas: state.citas.map((c) => (c.id === id ? { ...c, ...updatedCita } : c)),
      currentCita:
        state.currentCita?.id === id
          ? { ...state.currentCita, ...updatedCita }
          : state.currentCita,
      error: null,
    })),

  remove: (id) =>
    set((state) => ({
      citas: state.citas.filter((c) => c.id !== id),
      currentCita: state.currentCita?.id === id ? null : state.currentCita,
      error: null,
    })),

  setCurrent: (cita) =>
    set({
      currentCita: cita,
      error: null,
    }),

  setError: (error) => set({ error, loading: false }),

  setLoading: (loading) => set({ loading }),

  reset: () => set(initialState),
}));
