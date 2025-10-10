import React from "react";

export default function WelcomeBanner({ nombre }: { nombre: string }) {
  return (
    <div className="bg-cyan-50 rounded-2xl px-8 py-1 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-cyan-700">¡Hola {nombre}!</h1>
        <p className="text-gray-500">Estamos aquí para cuidarte.</p>
      </div>
      <img
        src="/img/home-banner-2.png"
        alt="Bienvenida Relax Spa"
        className="hidden md:block w-35"
      />
    </div>
  );
}
