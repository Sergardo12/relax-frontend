"use client";

import Link from "next/link";
import { AuthForm } from "@/components/domain/auth/AuthForm";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const login = useAuthStore((state) => state.login);

  async function handleRegister(data: { email: string; password: string; confirmPassword?: string }) {
    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    //Aqui se conectará el endpoint real
    const token = "demo-token";
    await login(token);
  }

  return (
    <>
      <AuthForm title="Registrarse" mode="register" onSubmit={handleRegister} />
      <p className="text-center text-sm mt-4 text-cyan-800">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}