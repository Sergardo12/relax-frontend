import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (token: string) => {
    // Guarda token localmente
    localStorage.setItem("token", token);

    // Simula fetch de usuario (conectar API real aquí)
    const fakeUser: User = { id: "u1", name: "Demo", email: "demo@relax.local" };

    set({
      user: fakeUser,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));