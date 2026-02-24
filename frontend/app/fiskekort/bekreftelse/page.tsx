"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import { getToken } from "@/lib/auth";
import { getBetalingStatus, BetalingStatus } from "@/lib/api";

function BekreftelseInnhold() {
  const searchParams = useSearchParams();
  const betalingId = searchParams.get("betaling_id");

  const [betaling, setBetaling] = useState<BetalingStatus | null>(null);
  const [feil, setFeil] = useState("");
  const [laster, setLaster] = useState(true);

  const hentStatus = useCallback(async () => {
    if (!betalingId) return;
    const token = getToken();
    if (!token) {
      setFeil("Du er ikke innlogget.");
      setLaster(false);
      return;
    }
    try {
      const data = await getBetalingStatus(betalingId, token);
      setBetaling(data);
    } catch {
      setFeil("Kunne ikke hente betalingsstatus.");
    } finally {
      setLaster(false);
    }
  }, [betalingId]);

  useEffect(() => {
    hentStatus();
  }, [hentStatus]);

  if (!betalingId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-red-600">Ingen betaling-ID funnet i URL.</p>
      </div>
    );
  }

  if (laster) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-blue-700 text-lg">Henter betalingsstatus…</p>
      </div>
    );
  }

  if (feil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-red-600">{feil}</p>
      </div>
    );
  }

  if (!betaling) return null;

  const erFullfort = betaling.betaling_status === "fullført";

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md text-center">
        {erFullfort ? (
          <>
            <div className="mb-4 text-4xl">✅</div>
            <h1 className="mb-2 text-2xl font-bold text-blue-900">
              Betaling mottatt!
            </h1>
            <p className="mb-6 text-gray-500">
              Vis QR-koden til oppsynsmann for kontroll.
            </p>

            <div className="mb-6 flex justify-center rounded-xl bg-white p-4 shadow-inner">
              <QRCode value={betaling.qr_kode} size={200} />
            </div>

            <div className="mb-6 rounded-xl bg-blue-50 p-4 text-left text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Korttype:</span>{" "}
                {betaling.type.charAt(0).toUpperCase() + betaling.type.slice(1)}
              </div>
              <div>
                <span className="font-medium">Redskap:</span>{" "}
                {betaling.redskap.charAt(0).toUpperCase() + betaling.redskap.slice(1)}
              </div>
              <div>
                <span className="font-medium">Gyldig:</span>{" "}
                {betaling.gyldig_fra} – {betaling.gyldig_til}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-green-600 font-semibold">Aktiv</span>
              </div>
            </div>

            <a
              href="/mine-kort"
              className="block rounded-xl bg-blue-700 py-2 text-white font-semibold hover:bg-blue-800 transition-colors"
            >
              Se alle mine kort
            </a>
          </>
        ) : (
          <>
            <div className="mb-4 text-4xl">⏳</div>
            <h1 className="mb-2 text-2xl font-bold text-blue-900">
              Venter på betaling…
            </h1>
            <p className="mb-6 text-gray-500">
              Betalingen er ikke bekreftet ennå. Prøv igjen om et øyeblikk.
            </p>
            <button
              onClick={() => { setLaster(true); hentStatus(); }}
              className="rounded-xl bg-blue-700 px-6 py-2 text-white font-semibold hover:bg-blue-800 transition-colors"
            >
              Oppdater status
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function BekreftelsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-blue-50">
          <p className="text-blue-700 text-lg">Laster…</p>
        </div>
      }
    >
      <BekreftelseInnhold />
    </Suspense>
  );
}
