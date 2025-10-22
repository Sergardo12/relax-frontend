"use client";

import React from "react";
import { FloatingInput } from "@/components/domain/auth/AuthForm";
import { useAuthStore } from "@/lib/store";
import { pacienteService } from "@/services/api";
import { useRouter } from "next/navigation";

export default function CompletarPerfilPaciente() {
  const router = useRouter();
  const { usuario, marcarPerfilCompleto } = useAuthStore();

  // 🔥 Cambiar a plural
  const [nombres, setNombres] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [fechaNacimiento, setFechaNacimiento] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!usuario?.id) {
      setError("No se encontró el usuario autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🔥 DTO correcto (nombres y apellidos en plural)
      const dto = {
        usuarioId: usuario.id,
        nombres,     // plural
        apellidos,   // plural
        dni,
        fechaNacimiento, // camelCase
        telefono,
      };

      console.log('📤 Enviadndo datos: ', dto)

      await pacienteService.completarDatos(dto);

      marcarPerfilCompleto();

      router.push("/paciente");
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data); // 🐛 DEBUG
      setError(error.response?.data?.message || "Error al completar datos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-2xl bg-white shadow-lg max-w-md mx-auto mt-10"
    >
      <h1 className="text-center text-2xl font-semibold text-gray-800">
        Completa tus datos personales
      </h1>

      <FloatingInput
        id="nombres"
        label="Nombres"
        value={nombres}
        onChange={setNombres}
        required
      />

      <FloatingInput
        id="apellidos"
        label="Apellidos"
        value={apellidos}
        onChange={setApellidos}
        required
      />

      <FloatingInput
        id="dni"
        label="DNI"
        type="text"
        value={dni}
        onChange={setDni}
        required
      />

      <FloatingInput
        id="fechaNacimiento"
        label="Fecha de nacimiento"
        type="date"
        value={fechaNacimiento}
        onChange={setFechaNacimiento}
        required
      />

      <FloatingInput
        id="telefono"
        label="Teléfono"
        type="tel"
        value={telefono}
        onChange={setTelefono}
        required
      />

      {error && (
        <p className="text-center text-sm text-red-600 mt-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-cyan-600 py-3 text-white font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Guardando..." : "Continuar"}
      </button>
    </form>
  );
}
