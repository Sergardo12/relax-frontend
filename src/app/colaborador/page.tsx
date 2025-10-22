"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Calendar, Users, FileText } from "lucide-react";

export default function ColaboradorDashboard() {
  // 🔒 Solo colaboradores pueden acceder
  const { isAuthenticated, loading } = useAuthGuard({ 
    allowedRoles: ['colaborador'] 
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
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Colaborador
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agenda */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Calendar className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mi Agenda</h3>
            <p className="text-gray-600">Ver citas programadas</p>
          </div>

          {/* Pacientes */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Users className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pacientes</h3>
            <p className="text-gray-600">Gestionar pacientes</p>
          </div>

          {/* Tratamientos */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <FileText className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tratamientos</h3>
            <p className="text-gray-600">Registrar servicios</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}