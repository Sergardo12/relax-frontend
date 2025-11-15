/**
 * Convierte una fecha string (YYYY-MM-DD) a Date con hora del mediodía
 * Esto evita problemas de timezone
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Convierte una fecha ISO del backend a Date con hora del mediodía
 */
export function parseDateFromBackend(dateString: string): Date {
  const soloFecha = dateString.split('T')[0];
  return parseDate(soloFecha);
}

/**
 * Formatea una fecha para mostrar al usuario
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? parseDateFromBackend(date) : date;
  
  return dateObj.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options
  });
}

/**
 * Convierte Date a formato YYYY-MM-DD para enviar al backend
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD (timezone local)
 */
export function getHoyString(): string {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Verifica si una fecha es hoy
 */
export function esHoy(fecha: string | Date): boolean {
  const fechaStr = typeof fecha === 'string' ? fecha.split('T')[0] : toISODate(fecha);
  return fechaStr === getHoyString();
}