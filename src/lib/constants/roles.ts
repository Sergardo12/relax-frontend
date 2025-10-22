export const ROLES = {
  PACIENTE: 'paciente',
  COLABORADOR: 'colaborador',
  ADMIN: 'admin',
  RECEPCIONISTA: 'recepcionista'
} as const;

export type RolType = typeof ROLES[keyof typeof ROLES];

export const RUTAS_POR_ROL: Record<RolType, string> = {
  [ROLES.PACIENTE]: '/paciente',
  [ROLES.COLABORADOR]: '/colaborador',
  [ROLES.ADMIN]: '/administrador',
  [ROLES.RECEPCIONISTA]: '/recepcionista'
};