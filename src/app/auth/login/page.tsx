"use client";

import Link from "next/link";
import { AuthForm } from "@/components/domain/auth/AuthForm";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);

  async function handleLogin(data: { email: string; password: string }) {
    const token = "demo-token";
    await login(token);
  }

  return (
    <>
      <AuthForm title="Iniciar sesión" mode="login" onSubmit={handleLogin} />
      <p className="text-center text-sm mt-4 text-cyan-800">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-indigo-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </>
  );
}