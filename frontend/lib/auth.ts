/**
 * lib/auth.ts
 *
 * Hjelpefunksjoner for JWT-token-lagring i localStorage.
 * Brukes av fremtidig bruker-portal (mine kort, fangstrapport).
 * Alle funksjoner er null-safe og fungerer i SSR-kontekst.
 */

const TOKEN_KEY = "fiskekort_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
