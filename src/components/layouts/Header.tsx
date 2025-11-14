// components/layouts/Header.tsx

"use client";

import React, { useEffect, useState } from "react";
import { HeartPulse, User } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { suscripcionService } from "@/services/api";
import Link from "next/link";

export default function Header() {
  const { usuario, obtenerDatosCompletos } = useAuthStore();
  const [nombreCompleto, setNombreCompleto] = useState<string>("Cargando...");
  const [tieneSuscripcionActiva, setTieneSuscripcionActiva] = useState(false);
  const [loadingSuscripcion, setLoadingSuscripcion] = useState(true);

  // Cargar datos completos
  useEffect(() => {
    if (!usuario) {
      setNombreCompleto("Usuario Invitado");
      return;
    }

    if (!usuario.perfil_completo) {
      setNombreCompleto(usuario.correo || "Usuario");
      return;
    }

    obtenerDatosCompletos().then((datos) => {
      if (datos?.nombres && datos?.apellidos) {
        setNombreCompleto(`${datos.nombres} ${datos.apellidos}`);
      } else if (datos?.nombres) {
        setNombreCompleto(datos.nombres);
      } else {
        setNombreCompleto(usuario.correo || "Usuario");
      }
    }).catch(() => {
      setNombreCompleto(usuario.correo || "Usuario");
    });
  }, [usuario, obtenerDatosCompletos]);

  // 🔥 Verificar suscripción activa
  useEffect(() => {
    if (usuario?.rol === 'paciente') {
      verificarSuscripcion();
    }
  }, [usuario]);

  async function verificarSuscripcion() {
    try {
      const datos = await obtenerDatosCompletos();
      if (datos?.id) {
        const suscripciones = await suscripcionService.getByPaciente(datos.id);
        const activa = suscripciones.some(s => s.estado === 'activa');
        setTieneSuscripcionActiva(activa);
      }
    } catch (err) {
      console.error('Error verificando suscripción:', err);
    } finally {
      setLoadingSuscripcion(false);
    }
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Botón de suscripción (solo para pacientes SIN suscripción activa) */}
      {usuario?.rol === 'paciente' && !tieneSuscripcionActiva && !loadingSuscripcion && (
        <Link 
          href="/paciente/suscripcion"
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-full hover:from-cyan-700 hover:to-blue-700 transition shadow-md"
        >
          <HeartPulse className="w-5 h-5" />
          Suscribirse
        </Link>
      )}

      {/* Si tiene suscripción, mostrar badge */}
      {usuario?.rol === 'paciente' && tieneSuscripcionActiva && (
        <Link 
          href="/paciente/suscripcion"
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-2.5 rounded-full hover:from-yellow-600 hover:to-orange-600 transition shadow-md"
        >
          <HeartPulse className="w-5 h-5" />
          Mi Membresía
        </Link>
      )}

      {/* Título para otros roles */}
      {usuario?.rol !== 'paciente' && (
        <h1 className="text-xl font-semibold text-gray-800 capitalize">
          Panel de {usuario?.rol === 'administrador' ? 'Administración' : usuario?.rol}
        </h1>
      )}

      {/* Usuario actual */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{nombreCompleto}</p>
          <p className="text-xs text-gray-500 capitalize">{usuario?.rol || 'Invitado'}</p>
        </div>
        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-cyan-600" />
        </div>
      </div>
    </header>
  );
}