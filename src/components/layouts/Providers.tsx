'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const { initAuth, loading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    initAuth();
    setIsInitialized(true);
  }, [initAuth]);

  // 🔥 CRÍTICO: No mostrar loading en rutas de auth
  const isAuthRoute = pathname.startsWith('/auth');
  
  // Solo mostrar loading si NO es ruta de auth
  if (!isInitialized && !isAuthRoute) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}