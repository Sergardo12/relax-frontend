"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { SIDEBAR_ITEMS } from "@/lib/constants/sidebar";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, usuario } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Obtener items según el rol
  const menuItems = usuario?.rol 
    ? SIDEBAR_ITEMS[usuario.rol as keyof typeof SIDEBAR_ITEMS] || []
    : [];

  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      setIsLoggingOut(true);
      await logout();
    }
  };

  if (!usuario) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-cyan-600">Relax Spa</h2>
        <p className="text-xs text-gray-500 mt-1 capitalize">{usuario.rol}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                  ? "bg-cyan-50 text-cyan-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
                }
                ${item.highlight ? "ring-2 ring-purple-200" : ""}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.highlight && (
                <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                  Beta
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
        </button>
      </div>
    </aside>
  );
}