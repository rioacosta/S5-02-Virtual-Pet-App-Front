import { jwtDecode } from "jwt-decode";

/**
 * Verifica si el token JWT está expirado.
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000; // JWT usa timestamp en segundos
    return decoded.exp < now;
  } catch {
    return true;
  }
}

/**
 * Extrae los roles desde el token JWT.
 */
export function getRolesFromToken(token: string): string[] {
  try {
    const decoded: any = jwtDecode(token);
    const roles = decoded.roles;
    return Array.isArray(roles) ? roles : [];
  } catch {
    return [];
  }
}

/**
 * Verifica si el usuario tiene el rol especificado.
 */
export function hasRole(token: string, role: string): boolean {
  const roles = getRolesFromToken(token);
  return roles.includes(role);
}
