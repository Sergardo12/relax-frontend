
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  title: "Iniciar sesión" | "Registrarse";
  mode: "login" | "register";
  onSubmit: (data: { correo: string; contraseña: string; confirmarContraseña?: string }) => Promise<void> | void;
};

export function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`
          w-full
          rounded-2xl
          border
          border-gray-200
          bg-white
          px-4
          ${floating ? "pt-4 pb-3" : "pt-6 pb-2"}
          text-sm text-gray-900
          transition-all duration-150 ease-in-out
          focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100
        `}
      />

      <label
        htmlFor={id}
        className={`
          absolute left-4 text-gray-500 transition-all duration-150 ease-in-out
          ${floating ? "top-2 text-xs text-cyan-600" : "top-4 text-sm"}
          pointer-events-none
        `}
      >
        {label}
      </label>
    </div>
  );
}

export function AuthForm({ title, mode, onSubmit }: AuthFormProps) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setconfirmarContraseña] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ correo, contraseña, confirmarContraseña });

    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-2xl bg-white shadow-lg">
      <h1 className="text-center text-2xl font-semibold text-gray-800">{title}</h1>

      <FloatingInput id="email" label="Correo electrónico" type="email" value={correo} onChange={setCorreo} required />

      <FloatingInput id="password" label="Contraseña" type="password" value={contraseña} onChange={setContraseña} required />

      {mode === "register" && (
        <FloatingInput
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          value={confirmarContraseña}
          onChange={setconfirmarContraseña}
          required
        />
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-cyan-600 py-3 text-white font-medium hover:bg-cyan-700 transition-colors disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Procesando..." : mode === "login" ? "Iniciar sesión" : "Registrarse"}
      </button>
    </form>
  );
}