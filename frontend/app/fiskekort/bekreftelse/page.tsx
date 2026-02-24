/**
 * app/fiskekort/bekreftelse/page.tsx
 *
 * @route /fiskekort/bekreftelse?betaling_id={UUID}
 * @beskrivelse Viser fiskekort med QR-kode etter bekreftet betaling.
 * @auth ingen
 * @apiKall GET /api/betaling/{betaling_id}  (via useBekreftelse.ts)
 *
 * Denne filen håndterer kun URL-params og Suspense-innpakking.
 * Polling-logikk: useBekreftelse.ts  |  Kortvisning: components/FiskekortKort.tsx
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FiskekortKort from "@/components/FiskekortKort";
import { useBekreftelse } from "./useBekreftelse";

function BekreftelseInnhold() {
  const betalingId = useSearchParams().get("betaling_id");
  const { tilstand, prøvIgjen } = useBekreftelse(betalingId);

  if (tilstand.fase === "laster") {
    return <StatusMelding tekst="Henter betalingsstatus…" />;
  }

  if (tilstand.fase === "venter") {
    return (
      <div className="text-center">
        <div className="text-4xl mb-3">⏳</div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Venter på bekreftelse…
        </h1>
        <p className="text-gray-500 mb-4">
          Forsøk {tilstand.forsok} av 20 – dette tar vanligvis noen sekunder.
        </p>
      </div>
    );
  }

  if (tilstand.fase === "feil") {
    return (
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-red-600 mb-4">{tilstand.melding}</p>
        <button
          onClick={prøvIgjen}
          className="rounded-xl bg-blue-700 px-6 py-2 text-white font-semibold hover:bg-blue-800"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  // fase === "ferdig"
  const { betaling } = tilstand;
  return (
    <>
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">✅</div>
        <h1 className="text-2xl font-bold text-blue-900">Betaling mottatt!</h1>
        <p className="text-gray-500 mt-1">
          Vis QR-koden til oppsyn, eller last ned kortet som PDF.
        </p>
      </div>

      <FiskekortKort betaling={betaling} />

      <div className="flex gap-3 mt-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-blue-700 px-6 py-3 text-white font-semibold hover:bg-blue-800 shadow"
        >
          Last ned PDF
        </button>
        <a
          href="/fiskekort/kjop"
          className="rounded-xl border-2 border-blue-700 px-6 py-3 text-blue-700 font-semibold hover:bg-blue-100"
        >
          Kjøp nytt kort
        </a>
      </div>

      <p className="mt-4 text-xs text-gray-400 print:hidden">
        Sendes også til {betaling.epost}
      </p>
    </>
  );
}

function StatusMelding({ tekst }: { tekst: string }) {
  return (
    <p className="text-blue-700 text-lg">{tekst}</p>
  );
}

export default function BekreftelsePage() {
  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <Suspense fallback={<StatusMelding tekst="Laster…" />}>
        <BekreftelseInnhold />
      </Suspense>
    </main>
  );
}
