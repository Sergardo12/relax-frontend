'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

interface UseAuthGuardOptions {
  allowedRoles?: string[]; // Roles permitidos en esta ruta
}

export function useAuthGuard(options?: UseAuthGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, usuario, loading } = useAuthStore();

  useEffect(() => {
    // Rutas públicas que NO necesitan autenticación
    const publicRoutes = ['/auth/login', '/auth/register', '/'];
    
    // Si está en ruta pública, no hacer nada
    if (publicRoutes.some(route => pathname === route || pathname.startsWith('/auth'))) {
      return;
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated && !loading) {
      router.push('/auth/login');
      return;
    }

    //  Verificar si el usuario tiene el rol permitido
    if (isAuthenticated && usuario && options?.allowedRoles) {
      if (!options.allowedRoles.includes(usuario.rol)) {
        // Redirigir a su dashboard correcto
        switch (usuario.rol) {
          case 'paciente':
            router.push('/paciente');
            break;
          case 'colaborador':
            router.push('/colaborador');
            break;
          case 'admin':
            router.push('/admin');
            break;
          default:
            router.push('/');
        }
      }
    }
  }, [isAuthenticated, usuario, loading, router, pathname, options]);

  return { isAuthenticated, usuario, loading };
}