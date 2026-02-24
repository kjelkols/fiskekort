/**
 * app/fiskekort/bekreftelse/useBekreftelse.ts
 *
 * Hook for bekreftelsessiden. Inneholder all polling-logikk og tilstand.
 *
 * Forretningsregler (jf. app-spec.ts → RUTER.bekreftelse.regler):
 *   - Poll GET /api/betaling/{id} hvert 3. sek inntil status === "fullført"
 *   - Maks 20 forsøk (60 sek totalt), deretter vis feilmelding
 *
 * API-kall: GET /api/betaling/{betaling_id} via lib/api.ts#getBetalingStatus
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { getBetalingStatus, type BetalingStatus } from "@/lib/api";

const POLL_INTERVALL_MS = 3_000;
const MAKS_FORSOK = 20;

export type BekreftelseTilstand =
  | { fase: "laster" }
  | { fase: "venter"; forsok: number }
  | { fase: "ferdig"; betaling: BetalingStatus }
  | { fase: "feil"; melding: string };

export function useBekreftelse(betalingId: string | null): {
  tilstand: BekreftelseTilstand;
  prøvIgjen: () => void;
} {
  const [tilstand, setTilstand] = useState<BekreftelseTilstand>({
    fase: "laster",
  });
  const forsokRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function stopp() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  async function poll() {
    if (!betalingId) {
      setTilstand({ fase: "feil", melding: "Ingen betaling-ID i URL." });
      return;
    }

    forsokRef.current += 1;

    if (forsokRef.current > MAKS_FORSOK) {
      setTilstand({
        fase: "feil",
        melding: "Betalingen lot seg ikke bekrefte innen 60 sekunder. Kontakt oss om du ble trukket.",
      });
      return;
    }

    try {
      const data = await getBetalingStatus(betalingId);
      if (data.betaling_status === "fullført") {
        stopp();
        setTilstand({ fase: "ferdig", betaling: data });
      } else {
        setTilstand({ fase: "venter", forsok: forsokRef.current });
        timerRef.current = setTimeout(poll, POLL_INTERVALL_MS);
      }
    } catch {
      setTilstand({ fase: "feil", melding: "Klarte ikke hente betalingsstatus." });
    }
  }

  function prøvIgjen() {
    forsokRef.current = 0;
    setTilstand({ fase: "laster" });
    poll();
  }

  useEffect(() => {
    poll();
    return stopp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betalingId]);

  return { tilstand, prøvIgjen };
}
