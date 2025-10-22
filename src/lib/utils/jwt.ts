// /lib/utils/jwt.ts
import { jwtDecode } from 'jwt-decode';
import { JWTPayload, UsuarioAuth } from '@/types';

export const jwtUtils = {
  /**
   * Decodifica el token JWT
   */
  decode: (token: string): JWTPayload | null => {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
      return null;
    }
  },

  /**
   * Convierte payload JWT a UsuarioAuth
   * 🔥 El perfil_completo lo leeremos de localStorage por ahora
   */
  payloadToUser: (payload: JWTPayload): UsuarioAuth => {
    const perfilCompleto = localStorage.getItem('perfil_completo') === 'true';
    
    return {
      id: payload.sub,
      correo: payload.correo,
      rol: payload.rol,
      perfil_completo: perfilCompleto,
    };
  },

  /**
   * Verifica si el token expiró
   */
  isExpired: (token: string): boolean => {
    const payload = jwtUtils.decode(token);
    if (!payload?.exp) return true;
    
    return Date.now() >= payload.exp * 1000;
  },

  /**
   * Extrae el usuario completo desde el token
   */
  getUserFromToken: (token: string): UsuarioAuth | null => {
    const payload = jwtUtils.decode(token);
    if (!payload) return null;
    
    return jwtUtils.payloadToUser(payload);
  },
};