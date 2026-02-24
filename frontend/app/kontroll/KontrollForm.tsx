/**
 * app/kontroll/KontrollForm.tsx
 *
 * UI-komponent for kontrollsiden. Inneholder INGEN logikk eller state.
 * All tilstand og logikk lever i useKontroll.ts.
 *
 * Viser:
 *   - Tekstfelt for manuell innskriving av QR-kode/UUID
 *   - Sjekk-knapp
 *   - Resultat: grønn (gyldig) / rød (ugyldig) / feilmelding
 */

"use client";

import { useKontroll } from "./useKontroll";
import type { KontrollSvar } from "@/lib/api";

export default function KontrollForm() {
  const { kode, setKode, tilstand, sjekkKode, nullstill } = useKontroll();

  return (
    <div className="flex flex-col gap-6">
      {/* Søkefelt */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Lim inn QR-kode (UUID)"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sjekkKode()}
          className="input flex-1 font-mono text-sm"
        />
        <button
          onClick={sjekkKode}
          disabled={tilstand.fase === "laster" || !kode.trim()}
          className="rounded-xl bg-blue-700 px-5 py-2 text-white font-semibold hover:bg-blue-800 disabled:opacity-50"
        >
          {tilstand.fase === "laster" ? "Sjekker…" : "Sjekk"}
        </button>
      </div>

      {/* Resultat */}
      {tilstand.fase === "gyldig" && (
        <Resultat svar={tilstand.svar} gyldig onNullstill={nullstill} />
      )}
      {tilstand.fase === "ugyldig" && (
        <Resultat svar={tilstand.svar} gyldig={false} onNullstill={nullstill} />
      )}
      {tilstand.fase === "feil" && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-5 text-center">
          <p className="text-red-700 font-semibold">{tilstand.melding}</p>
          <button onClick={nullstill} className="mt-3 text-sm text-red-600 underline">
            Prøv igjen
          </button>
        </div>
      )}
    </div>
  );
}

function Resultat({
  svar,
  gyldig,
  onNullstill,
}: {
  svar: KontrollSvar;
  gyldig: boolean;
  onNullstill: () => void;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        gyldig ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{gyldig ? "✅" : "❌"}</span>
        <span
          className={`text-lg font-bold ${
            gyldig ? "text-green-700" : "text-red-700"
          }`}
        >
          {gyldig ? "Gyldig fiskekort" : "Ugyldig fiskekort"}
        </span>
      </div>

      <table className="w-full text-sm text-gray-700">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-1 font-medium text-gray-500">Type</td>
            <td className="py-1 text-right capitalize">{svar.type}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-1 font-medium text-gray-500">Redskap</td>
            <td className="py-1 text-right capitalize">{svar.redskap}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-1 font-medium text-gray-500">Gyldig fra</td>
            <td className="py-1 text-right">{svar.gyldig_fra}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-1 font-medium text-gray-500">Gyldig til</td>
            <td className="py-1 text-right">{svar.gyldig_til}</td>
          </tr>
          <tr>
            <td className="py-1 font-medium text-gray-500">Status</td>
            <td className="py-1 text-right">{svar.status}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={onNullstill} className="mt-4 text-sm text-gray-500 underline">
        Sjekk ny kode
      </button>
    </div>
  );
}
