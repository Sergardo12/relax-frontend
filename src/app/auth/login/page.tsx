"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/domain/auth/AuthForm";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { RUTAS_POR_ROL, ROLES, RolType } from "@/lib/constants/roles";

export default function LoginPage() {
  const { login, error, isAuthenticated, usuario } = useAuthStore();
  const router = useRouter();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && usuario) {
      redirectByRole(usuario.rol, usuario.perfil_completo);
    }
  }, [isAuthenticated, usuario]);

  function redirectByRole(rol: string, perfilCompleto: boolean) {
    if (!perfilCompleto) {
      if (rol === ROLES.PACIENTE) {
        router.replace("/auth/completar-perfil/paciente");
      } else if (rol === ROLES.COLABORADOR) {
        router.replace("/auth/completar-perfil/colaborador");
      }
      return;
    }

    const ruta = RUTAS_POR_ROL[rol as RolType];
    router.replace(ruta || '/');
  }

  async function handleLogin(data: { correo: string; contraseña: string; confirmarContraseña?: string }) {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    
    try {
      // 🔥 SOLUCIÓN: Solo enviar correo y contraseña (sin confirmarContraseña)
      const result = await login({
        correo: data.correo,
        contraseña: data.contraseña
        // NO enviar confirmarContraseña
      });

      if (result.success) {
        const { usuario: updatedUsuario } = useAuthStore.getState();
        if (updatedUsuario) {
          redirectByRole(updatedUsuario.rol, !result.needsProfile);
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      isProcessingRef.current = false;
    }
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <AuthForm title="Iniciar sesión" mode="login" onSubmit={handleLogin} />
      {error && (
        <p className="text-center text-sm text-red-600 mt-2">{error}</p>
      )}
      <p className="text-center text-sm mt-4 text-cyan-800">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-indigo-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </>
  );
}