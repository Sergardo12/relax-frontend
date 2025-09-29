"useClient";
import React, { createContext, useContext, useState, useEffect } from "react";
import type {User} from "@/types/user";


type AuthContextType = {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    async function login(token: string){
        // guarda el token en localStorage y buca user (ejemplo)
        localStorage.setItem("token", token);
        // fetch user desde /me (implementa service)
        //const data = await fetcher("auth/me";, {headers: ...})
         setUser({ id: "u1", name: "Demo", email: "demo@relax.local" });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
    
