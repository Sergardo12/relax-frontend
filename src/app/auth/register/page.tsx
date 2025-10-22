"use client";

import Link from "next/link";
import { AuthForm } from "@/components/domain/auth/AuthForm";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const { register, loading, error, isAuthenticated, usuario } = useAuthStore();
  const router = useRouter();
  const [validationError, setValidationError] = useState<string | null>(null);

  // 🔒 Si YA está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated && usuario) {
      if (usuario.perfil_completo) {
        router.push("/home");
      } else {
        router.push("/auth/completar-perfil/paciente");
      }
    }
  }, [isAuthenticated, usuario, router]);

  async function handleRegister(data: {
    correo: string;
    contraseña: string;
    confirmarContraseña?: string;
  }) {
    // Limpiar error de validación previo
    setValidationError(null);

    // Validar que las contraseñas coincidan
    if (data.contraseña !== data.confirmarContraseña) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }

    try {
      // 🔥 Ahora register retorna { success }
      const result = await register({
        correo: data.correo,
        contraseña: data.contraseña,
      });

      if (result.success) {
        // ✅ Registro exitoso → redirigir a login
        router.push("/auth/login?registered=true");
      }
      // Si no es exitoso, el error ya está en el store
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  }

  // Mostrar loading si está autenticado (redirigiendo)
  if (isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <AuthForm title="Registrarse" mode="register" onSubmit={handleRegister} />
      
      {/* Mostrar errores de validación o del backend */}
      {(validationError || error) && (
        <p className="text-center text-sm text-red-600 mt-2">
          {validationError || error}
        </p>
      )}

      <p className="text-center text-sm mt-4 text-cyan-800">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}