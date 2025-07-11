// src/utils/authUtils.ts
import { jwtDecode } from "jwt-decode";

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
