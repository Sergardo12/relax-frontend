"use client";

import React, { useState } from "react";
import { FloatingInput } from "@/components/domain/auth/AuthForm"; 

export default function RegisterStep2() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ nombres, apellidos, dni, fechaNacimiento, telefono });
    // Aquí se conecta con el backend
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-2xl bg-white shadow-lg max-w-md mx-auto mt-10"
    >
      <h1 className="text-center text-2xl font-semibold text-gray-800">
        Registre sus datos personales
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

      <button
        type="submit"
        className="w-full rounded-full bg-cyan-600 py-3 text-white font-medium hover:bg-cyan-700 transition-colors"
      >
        Continuar
      </button>
    </form>
  );
}
