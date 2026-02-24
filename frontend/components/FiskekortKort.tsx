/**
 * components/FiskekortKort.tsx
 *
 * Visuelt fiskekort med QR-kode. Gjenbrukbar komponent.
 * Brukes på /fiskekort/bekreftelse. Fremtidig: mine-kort-siden.
 *
 * Props:
 *   betaling – BetalingStatus fra GET /api/betaling/{id}
 *
 * PDF-utskrift: legg id="fiskekort-print" på rot-elementet.
 * @media print i globals.css skjuler alt annet.
 */

"use client";

import QRCode from "react-qr-code";
import type { BetalingStatus } from "@/lib/api";
import { ORG, KORTTYPER } from "@/app-spec";

type Props = {
  betaling: BetalingStatus;
};

const kortNavn = (verdi: string): string =>
  KORTTYPER.find((k) => k.verdi === verdi)?.label ?? verdi;

export default function FiskekortKort({ betaling }: Props) {
  const kortId = betaling.fiskekort_id.slice(0, 8).toUpperCase();

  return (
    <div
      id="fiskekort-print"
      className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl border border-blue-200 bg-white"
    >
      {/* Toppbanner */}
      <div className="bg-blue-800 text-white px-6 py-4 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-300 mb-1">
          Fiskekort
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          {kortNavn(betaling.type)}
        </h2>
        <p className="text-sm text-blue-300 mt-1">{ORG}</p>
      </div>

      {/* QR-kode */}
      <div className="flex justify-center py-6 bg-white">
        <div className="p-3 rounded-xl shadow-md border border-gray-100">
          <QRCode value={betaling.qr_kode} size={160} />
        </div>
      </div>

      {/* Kortdetaljer */}
      <div className="px-6 pb-2">
        <table className="w-full text-sm text-gray-700">
          <tbody>
            <Row label="Innehaver" verdi={betaling.navn} bold />
            <Row label="Redskap"   verdi={capitalize(betaling.redskap)} />
            <Row label="Gyldig fra" verdi={betaling.gyldig_fra} />
            <Row label="Gyldig til" verdi={betaling.gyldig_til} />
            <tr>
              <td className="py-2 font-medium text-gray-500">Status</td>
              <td className="py-2 text-right">
                <span className="inline-block bg-green-100 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold">
                  Aktiv
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bunntekst */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 font-mono">#{kortId}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  verdi,
  bold,
}: {
  label: string;
  verdi: string;
  bold?: boolean;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 font-medium text-gray-500">{label}</td>
      <td className={`py-2 text-right ${bold ? "font-semibold" : ""}`}>
        {verdi}
      </td>
    </tr>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
