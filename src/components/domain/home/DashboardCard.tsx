import React from "react";
import { ShoppingCart } from "lucide-react";

export default function DashboardCard({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition"
    >
      {/* Sección izquierda con ícono e información */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-cyan-100 rounded-full">
          <ShoppingCart className="w-6 h-6 text-cyan-600" />
        </div>
        <span className="text-gray-800 font-medium">{title}</span>
      </div>

      {/* Flecha indicativa */}
      <span className="text-cyan-600 font-semibold">{">"}</span>
    </div>
  );
}
