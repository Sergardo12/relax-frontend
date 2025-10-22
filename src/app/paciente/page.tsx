"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import ListaCitas from "@/components/domain/paciente/ListaCitas";
import { CalendarPlus } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import WelcomeBanner from "@/components/domain/paciente/WelcomeBanner";
import AgendarCitaModal from "@/components/domain/cita/AgenddarCitaModal";

export default function PacienteDashboard() {
  const { isAuthenticated, loading } = useAuthGuard({
    allowedRoles: ["paciente"],
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8 p-6">
        {/* Banner de bienvenida */}
        <WelcomeBanner />

        {/* Grid: Agendar Cita + Mis Citas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {/* Card de Agendar Cita */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-4 text-white w-full lg:w-4/5 mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <CalendarPlus className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">¿Necesitas una cita?</h3>
              <p className="text-cyan-50 text-sm mb-4">
                Agenda tu próxima sesión de forma rápida y sencilla
              </p>
            </div>
            <AgendarCitaModal />
          </div>
          {/* Lista de Citas */}
          <ListaCitas limite={3} mostrarBotonVerTodas={true} />
        </div>
      </div>
    </Layout>
  );
}
