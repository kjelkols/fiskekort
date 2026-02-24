/**
 * lib/api.ts
 *
 * API-klient for Øvre Gloppen Elveeigarlag Fiskekort.
 * Alle serverforespørsler og tilhørende TypeScript-typer er samlet her.
 *
 * Endepunkter (se backend/app/routers/ for implementasjon):
 *   POST /api/betaling/checkout       – Start Stripe Checkout (gjest)
 *   GET  /api/betaling/{id}           – Hent betalingsstatus
 *   GET  /api/kontroll/qr/{kode}      – Sjekk QR-kode (oppsynsmann)
 *   POST /api/auth/login              – Logg inn (bruker-portal)
 *   POST /api/auth/register           – Registrer bruker
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Typer
// ---------------------------------------------------------------------------

export type CheckoutRequest = {
  epost: string;
  navn: string;
  type: string;
  redskap: string;
  gyldig_fra: string; // YYYY-MM-DD
  gyldig_til: string; // YYYY-MM-DD
};

export type CheckoutResponse = {
  checkout_url: string;
  betaling_id: string;
};

export type BetalingStatus = {
  betaling_id: string;
  betaling_status: "pending" | "fullført" | "feilet";
  fiskekort_id: string;
  fiskekort_status: string;
  qr_kode: string;
  type: string;
  redskap: string;
  gyldig_fra: string;
  gyldig_til: string;
  epost: string;
  navn: string;
};

export type KontrollSvar = {
  gyldig: boolean;
  status: string;
  type: string;
  redskap: string;
  gyldig_fra: string;
  gyldig_til: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

// ---------------------------------------------------------------------------
// Betaling
// ---------------------------------------------------------------------------

export async function initierCheckout(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  const res = await fetch(`${API_BASE}/api/betaling/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Checkout feilet");
  }
  return res.json();
}

export async function getBetalingStatus(
  betalingId: string
): Promise<BetalingStatus> {
  const res = await fetch(`${API_BASE}/api/betaling/${betalingId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Betaling ikke funnet");
  return res.json();
}

// ---------------------------------------------------------------------------
// Kontroll
// ---------------------------------------------------------------------------

export async function kontrollerQR(kode: string): Promise<KontrollSvar> {
  const normert = kode.trim().toLowerCase();
  const res = await fetch(`${API_BASE}/api/kontroll/qr/${normert}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("QR-kode ikke funnet");
  return res.json();
}

// ---------------------------------------------------------------------------
// Auth (brukt av fremtidig bruker-portal)
// ---------------------------------------------------------------------------

export async function loggInn(
  epost: string,
  passord: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({ username: epost, password: passord });
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error("Feil e-post eller passord");
  return res.json();
}

