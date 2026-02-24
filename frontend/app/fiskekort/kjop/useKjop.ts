/**
 * app/fiskekort/kjop/useKjop.ts
 *
 * Hook som inneholder ALL tilstand og forretningslogikk for kjøpsflyten.
 * KjopForm.tsx kaller kun funksjoner herfra og viser tilstand herfra.
 *
 * Forretningsregler (jf. app-spec.ts → RUTER.kjop.regler):
 *   - gyldig_til >= gyldig_fra  (valideres her)
 *   - Dagskort: gyldig_fra settes automatisk som gyldig_til
 *
 * API-kall: POST /api/betaling/checkout via lib/api.ts#initierCheckout
 */

"use client";

import { useState } from "react";
import { initierCheckout } from "@/lib/api";
import { KORTTYPER, REDSKAP, type Korttype, type Redskap } from "@/app-spec";

const iDag = () => new Date().toISOString().split("T")[0];

export type KjopState = {
  navn: string;
  epost: string;
  type: Korttype;
  redskap: Redskap;
  gyldigFra: string;
  gyldigTil: string;
  laster: boolean;
  feil: string;
};

export type KjopHandlers = {
  setNavn: (v: string) => void;
  setEpost: (v: string) => void;
  setType: (v: Korttype) => void;
  setRedskap: (v: Redskap) => void;
  setGyldigFra: (v: string) => void;
  setGyldigTil: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export function useKjop(): KjopState & KjopHandlers {
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [type, setTypeState] = useState<Korttype>("dagskort");
  const [redskap, setRedskap] = useState<Redskap>("Stang");
  const [gyldigFra, setGyldigFraState] = useState(iDag());
  const [gyldigTil, setGyldigTilState] = useState(iDag());
  const [laster, setLaster] = useState(false);
  const [feil, setFeil] = useState("");

  // Dagskort: tving gyldig_til === gyldig_fra
  function setType(v: Korttype) {
    setTypeState(v);
    if (v === "dagskort") setGyldigTilState(gyldigFra);
  }

  function setGyldigFra(v: string) {
    setGyldigFraState(v);
    if (type === "dagskort") setGyldigTilState(v);
    // Forhindre gyldig_til < gyldig_fra
    if (gyldigTil < v) setGyldigTilState(v);
  }

  function setGyldigTil(v: string) {
    if (type === "dagskort") return; // Dagskort styres av gyldig_fra
    setGyldigTilState(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeil("");

    if (gyldigTil < gyldigFra) {
      setFeil("Gyldig til kan ikke være før gyldig fra.");
      return;
    }

    setLaster(true);
    try {
      const res = await initierCheckout({
        epost,
        navn,
        type,
        redskap: redskap.toLowerCase(),
        gyldig_fra: gyldigFra,
        gyldig_til: gyldigTil,
      });
      window.location.href = res.checkout_url;
    } catch (err) {
      setFeil(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setLaster(false);
    }
  }

  return {
    navn, epost, type, redskap, gyldigFra, gyldigTil, laster, feil,
    setNavn, setEpost, setType, setRedskap, setGyldigFra, setGyldigTil,
    handleSubmit,
  };
}

// Re-eksporter konstanter slik at KjopForm.tsx bare importerer fra denne filen
export { KORTTYPER, REDSKAP };
