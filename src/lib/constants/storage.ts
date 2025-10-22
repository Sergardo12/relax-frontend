// ==================== STORAGE KEYS ====================
// Centraliza las keys del localStorage para evitar typos

export const STORAGE_KEYS = {
  TOKEN: 'token',
  PERFIL_COMPLETO: 'perfil_completo',
  ROL: 'rol',
} as const;

// Helper para limpiar todo el storage de auth
export const clearAuthStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Helper para verificar si hay sesión guardada
export const hasStoredSession = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};