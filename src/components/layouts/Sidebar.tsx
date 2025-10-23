"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Home, Calendar, CreditCard, LogOut } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    {
      label: "Inicio",
      href: "/paciente",
      icon: Home,
    },
    {
      label: "Mis Tratamientos",
      href: "/paciente/tratamientos",
      icon: Calendar,
    },
    {
      label: "Mi Suscripción",
      href: "/paciente/suscripcion",
      icon: CreditCard,
    },
  ];

  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      setIsLoggingOut(true);
      await logout();
      // El método logout ya redirige automáticamente
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-cyan-600">Relax Spa</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            w-full flex items-center gap-3 px-4 py-3 rounded-lg 
            text-red-600 hover:bg-red-50 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
        </button>
      </div>
    </aside>
  );
}