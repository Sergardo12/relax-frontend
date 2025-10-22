// ==================== COLABORADOR STORE ====================

import { create } from 'zustand';
import { Colaborador } from '@/types';

interface ColaboradorState {
  // Estado
  colaboradores: Colaborador[];
  currentColaborador: Colaborador | null;
  loading: boolean;
  error: string | null;

  // Actions
  set: (colaboradores: Colaborador[]) => void;
  add: (colaborador: Colaborador) => void;
  update: (id: string, colaborador: Partial<Colaborador>) => void;
  remove: (id: string) => void;
  setCurrent: (colaborador: Colaborador | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  colaboradores: [],
  currentColaborador: null,
  loading: false,
  error: null,
};

export const useColaboradorStore = create<ColaboradorState>((set) => ({
  ...initialState,

  set: (colaboradores) =>
    set({
      colaboradores,
      error: null,
    }),

  add: (colaborador) =>
    set((state) => ({
      colaboradores: [...state.colaboradores, colaborador],
      error: null,
    })),

  update: (id, updatedColaborador) =>
    set((state) => ({
      colaboradores: state.colaboradores.map((c) =>
        c.id === id ? { ...c, ...updatedColaborador } : c
      ),
      currentColaborador:
        state.currentColaborador?.id === id
          ? { ...state.currentColaborador, ...updatedColaborador }
          : state.currentColaborador,
      error: null,
    })),

  remove: (id) =>
    set((state) => ({
      colaboradores: state.colaboradores.filter((c) => c.id !== id),
      currentColaborador:
        state.currentColaborador?.id === id ? null : state.currentColaborador,
      error: null,
    })),

  setCurrent: (colaborador) =>
    set({
      currentColaborador: colaborador,
      error: null,
    }),

  setError: (error) => set({ error, loading: false }),

  setLoading: (loading) => set({ loading }),

  reset: () => set(initialState),
}));
