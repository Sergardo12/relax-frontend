import { useAuthStore } from "@/lib/store";
import React, { useEffect, useState } from "react";


export default function WelcomeBanner() {
const {usuario, obtenerDatosCompletos} = useAuthStore()
const [nombreCompleto, setNombreCompleto] = useState('')
const [loading, setLoading] = useState(true);

useEffect(() => {
    console.log('🎨 WelcomeBanner montado');
    console.log('👤 Usuario actual:', usuario);
    
    async function cargarDatos() {
      try {
        setLoading(true);
        console.log('🔄 Cargando datos completos...');
        
        const datos = await obtenerDatosCompletos();
        console.log('📦 Datos obtenidos:', datos);
        
        // 🔥 CORRECCIÓN: Buscar "nombres" y "apellidos" (plural)
        if (datos?.nombres && datos?.apellidos) {
          const nombre = `${datos.nombres} ${datos.apellidos}`;
          console.log('✅ Nombre completo:', nombre);
          setNombreCompleto(nombre);
        } else {
          console.log('⚠️ No se encontraron nombres y apellidos en los datos');
        }
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (usuario) {
      cargarDatos();
    }
  }, [usuario, obtenerDatosCompletos]);

  const nombreMostrar = nombreCompleto || usuario?.correo?.split('@')[0] || 'Usuario';

  console.log('🖼️ Renderizando con nombre:', nombreMostrar);

  return (
    <div className="bg-cyan-50 rounded-2xl px-8 py-1 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-cyan-700">
          ¡Hola, {nombreCompleto || usuario?.correo?.split('@')[0] || 'Usuario'}! 👋
        </h1>
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
