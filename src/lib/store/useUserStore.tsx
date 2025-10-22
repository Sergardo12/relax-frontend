import { create } from "zustand";

type UserState = {
  nombres: string;
  apellidos: string;
  setNombres: (nombres: string) => void;
  setApellidos: (apellidos: string) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  nombres: "",
  apellidos: "",
  setNombres: (nombres) => set({ nombres }),
  setApellidos: (apellidos) => set({ apellidos }),
  resetUser: () => set({ nombres: "", apellidos: "" }),
}));