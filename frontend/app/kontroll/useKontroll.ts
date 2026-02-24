/**
 * app/kontroll/useKontroll.ts
 *
 * Hook for kontrollsiden. Inneholder all tilstand og API-logikk.
 *
 * Forretningsregler (jf. app-spec.ts → RUTER.kontroll.regler):
 *   - kode strippes for whitespace og gjøres lowercase før API-kall
 *   - API returnerer { gyldig, status, type, redskap, gyldig_fra, gyldig_til }
 *
 * API-kall: GET /api/kontroll/qr/{kode} via lib/api.ts#kontrollerQR
 */

"use client";

import { useState } from "react";
import { kontrollerQR, type KontrollSvar } from "@/lib/api";

export type KontrollTilstand =
  | { fase: "tom" }
  | { fase: "laster" }
  | { fase: "gyldig"; svar: KontrollSvar }
  | { fase: "ugyldig"; svar: KontrollSvar }
  | { fase: "feil"; melding: string };

export function useKontroll() {
  const [kode, setKode] = useState("");
  const [tilstand, setTilstand] = useState<KontrollTilstand>({ fase: "tom" });

  async function sjekkKode() {
    const trimmet = kode.trim();
    if (!trimmet) return;

    setTilstand({ fase: "laster" });
    try {
      const svar = await kontrollerQR(trimmet);
      setTilstand({
        fase: svar.gyldig ? "gyldig" : "ugyldig",
        svar,
      });
    } catch {
      setTilstand({ fase: "feil", melding: "QR-koden ble ikke funnet." });
    }
  }

  function nullstill() {
    setKode("");
    setTilstand({ fase: "tom" });
  }

  return { kode, setKode, tilstand, sjekkKode, nullstill };
}
