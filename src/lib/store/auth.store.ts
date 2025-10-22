// ==================== AUTH STORE ====================
import { create } from 'zustand';
import { LoginDto, RegisterPacienteDto, UsuarioAuth } from '@/types';
import { authService, pacienteService, colaboradorService } from '@/services/api';
import { jwtUtils } from '@/lib/utils/jwt';
import { STORAGE_KEYS, clearAuthStorage } from '@/lib/constants/storage';

interface AuthState {
  // ===== ESTADO =====
  usuario: UsuarioAuth | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // ===== ACCIONES BÁSICAS =====
  setUser: (usuario: UsuarioAuth) => void;
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;

  // ===== ACCIONES PRINCIPALES =====
  login: (dto: LoginDto) => Promise<{ success: boolean; needsProfile: boolean }>;
  register: (dto: RegisterPacienteDto) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  initAuth: () => void;
  
  // ===== PERFIL =====
  marcarPerfilCompleto: () => void;
  verificarPerfil: () => Promise<boolean>;
  obtenerDatosCompletos: () => Promise<any>; // 🔥 NUEVO
}

const initialState = {
  usuario: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  // ==================== SETTERS BÁSICOS ====================
  
  setUser: (usuario) =>
    set({
      usuario,
      isAuthenticated: true,
      error: null,
    }),

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    set({ token });
  },

  setError: (error) => set({ error, loading: false }),

  setLoading: (loading) => set({ loading }),

  clearError: () => set({ error: null }),

  // ==================== LOGIN ====================
  
  login: async (dto) => {
    set({ loading: true, error: null });
    
    try {
      // 1. Autenticar con el backend
      const response = await authService.login(dto);
      const { access_token } = response;

      // 2. Guardar token PRIMERO (para que el interceptor funcione)
      localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
      set({ token: access_token });

      // 3. Obtener perfil del usuario
      const perfil = await authService.getPerfil();
      
      // 4. Construir objeto usuario
      const usuario: UsuarioAuth = {
        id: perfil.id,
        correo: perfil.correo,
        rol: perfil.rol.nombre,
        perfil_completo: perfil.perfilCompleto,
      };

      // 5. Guardar datos en localStorage
      localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, String(perfil.perfilCompleto));
      localStorage.setItem(STORAGE_KEYS.ROL, perfil.rol.nombre); // 🔥 AGREGADO

      // 6. Actualizar estado
      set({
        usuario,
        isAuthenticated: true,
        loading: false,
      });

      console.log('✅ Login exitoso:', usuario);

      return {
        success: true,
        needsProfile: !perfil.perfilCompleto,
      };

    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      // Limpiar storage si falla
      clearAuthStorage();
      
      const errorMsg = error.response?.data?.message || 'Error al iniciar sesión';
      set({ error: errorMsg, loading: false, token: null });
      
      return {
        success: false,
        needsProfile: false,
      };
    }
  },

  // ==================== REGISTER ====================
  
  register: async (dto) => {
    set({ loading: true, error: null });
    
    try {
      await authService.register(dto);
      
      set({ loading: false });
      console.log('✅ Registro exitoso');
      
      return { success: true };
      
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      
      const errorMsg = error.response?.data?.message || 'Error al registrarse';
      set({ error: errorMsg, loading: false });
      
      return { success: false };
    }
  },

  // ==================== LOGOUT ====================
  
  logout: async () => {
    try {
      // TODO: Descomentar cuando el backend tenga endpoint de logout
      // await authService.logout();
      
      console.log('👋 Cerrando sesión...');
    } catch (error) {
      console.error('⚠️ Error en logout del backend:', error);
    } finally {
      // Limpiar localStorage usando helper
      clearAuthStorage();
      
      // Reset estado
      set(initialState);
      
      console.log('✅ Sesión cerrada');
      
      // 🔥 NUEVO: Redirigir a login automáticamente
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  },

  // ==================== INIT AUTH ====================
  
  initAuth: () => {
    set({ loading: true });
    
    console.log('🔄 Inicializando autenticación...');
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // Sin token, estado inicial
    if (!token) {
      console.log('⚠️ No hay token guardado');
      set({ ...initialState, loading: false });
      return;
    }

    // Verificar si el token expiró
    if (jwtUtils.isExpired(token)) {
      console.log('⚠️ Token expirado');
      clearAuthStorage();
      set({ ...initialState, loading: false });
      return;
    }

    // Reconstruir usuario desde token y localStorage
    const usuario = jwtUtils.getUserFromToken(token);
    
    if (usuario && usuario.rol) {
      console.log('✅ Sesión restaurada:', usuario);
      
      set({
        token,
        usuario,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      console.log('❌ Token inválido o datos incompletos');
      clearAuthStorage();
      set({ ...initialState, loading: false });
    }
  },

  // ==================== MARCAR PERFIL COMPLETO ====================
  
  marcarPerfilCompleto: () => {
    localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, 'true');
    
    const { usuario } = get();
    if (usuario) {
      set({
        usuario: {
          ...usuario,
          perfil_completo: true,
        },
      });
      
      console.log('✅ Perfil marcado como completo');
    }
  },

  // ==================== VERIFICAR PERFIL ====================
  
  verificarPerfil: async () => {
    const { usuario } = get();
    if (!usuario) {
      console.log('⚠️ No hay usuario para verificar');
      return false;
    }

    try {
      const perfil = await authService.getPerfil();
      
      localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, String(perfil.perfilCompleto));
      
      set({
        usuario: {
          ...usuario,
          perfil_completo: perfil.perfilCompleto,
        },
      });
      
      console.log('✅ Perfil verificado:', perfil.perfilCompleto);
      return perfil.perfilCompleto;
      
    } catch (error) {
      console.error('❌ Error verificando perfil:', error);
      return false;
    }
  },

  // ==================== OBTENER DATOS COMPLETOS ====================
  // 🔥 NUEVO: Obtiene los datos completos del paciente/colaborador
  
  obtenerDatosCompletos: async () => {
    const { usuario } = get();
    
    if (!usuario) {
      console.log('⚠️ No hay usuario autenticado');
      return null;
    }

    try {
      let datos = null;
      
      // Según el rol, llamar al endpoint correcto
      if (usuario.rol === 'paciente') {
        datos = await pacienteService.getMe();
        console.log('✅ Datos del paciente obtenidos:', datos);
      } else if (usuario.rol === 'colaborador') {
        datos = await colaboradorService.getMe();
        console.log('✅ Datos del colaborador obtenidos:', datos);
      }
      
      return datos;
      
    } catch (error) {
      console.error('❌ Error obteniendo datos completos:', error);
      return null;
    }
  },
}));