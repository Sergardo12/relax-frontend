import React from "react";
import { HeartPulse, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Botón de suscripción */}
      <button className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition">
        <HeartPulse className="w-5 h-5" />
        Suscribirse
      </button>

      {/* Usuario actual */}
      <div className="flex items-center gap-2 text-cyan-700 font-semibold">
        <User className="w-5 h-5" />
        Cristobal Colon
      </div>
    </header>
  );
}
