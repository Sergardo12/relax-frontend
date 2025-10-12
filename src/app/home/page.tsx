"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import WelcomeBanner from "@/components/domain/home/WelcomeBanner";
import { CalendarPlus, FileHeart, ChevronRight } from "lucide-react";

export default function HomePage() {
  const citas = [
    { id: 1, titulo: "Cita 1", fecha: "2025-10-09" },
    { id: 2, titulo: "Cita 2", fecha: "2025-10-12" },
    { id: 3, titulo: "Cita 3", fecha: "2025-10-18" },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8 p-6">
        {/* Banner superior */}
        <WelcomeBanner/>

        {/* Sección principal */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Card de agendar cita */}
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6 w-full md:w-1/2 text-center">
            <CalendarPlus className="w-16 h-16 text-cyan-600 mb-3" />
            <p className="text-gray-500 font-medium text-lg mb-3">
              ¿Te gustaría agendar una cita?
            </p>
            <button className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full text-sm font-medium transition">
              <CalendarPlus className="w-4 h-4" />
              Agendar cita
            </button>
          </div>

          {/* Listado de citas */}
          <div className="flex flex-col bg-white rounded-2xl shadow-md p-5 w-full md:w-1/2">
            <h2 className="text-gray-600 text-lg font-semibold mb-3">
              Tus Citas
            </h2>
            <div className="flex flex-col divide-y divide-gray-200">
              {citas.map((cita) => (
                <div
                  key={cita.id}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileHeart className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="text-gray-800 font-medium">{cita.titulo}</p>
                      <p className="text-gray-500 text-sm">{cita.fecha}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cyan-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}