import React from "react";
import { Home, CalendarDays, HelpCircle, BadgeDollarSign, ChartColumn } from "lucide-react";

const menuItems = [
  { name: "Inicio", icon: <Home size={18} /> },
  { name: "Mis Tratamientos", icon: <CalendarDays size={18} /> },
  { name: "Mis Pagos", icon: <BadgeDollarSign size={18} /> },
  { name: "Estadísticas", icon: <ChartColumn size={18} /> },
  { name: "Ayuda", icon: <HelpCircle size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="text-cyan-600 font-bold text-xl mb-6">Relax Spa</div>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
