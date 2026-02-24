/**
 * app/kontroll/page.tsx
 *
 * @route /kontroll
 * @beskrivelse Oppsynsmann sjekker gyldighet av fiskekort via QR-kode (UUID).
 * @auth ingen
 * @apiKall GET /api/kontroll/qr/{kode}  (via useKontroll.ts)
 *
 * Denne filen er kun en sideramme. Logikk: useKontroll.ts | UI: KontrollForm.tsx
 */

import KontrollForm from "./KontrollForm";
import { ORG } from "@/app-spec";

export const metadata = {
  title: `Kontroll – ${ORG}`,
};

export default function KontrollPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-blue-900">
          🔍 Kortkontroll
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Lim inn QR-koden fra fiskekort for å sjekke gyldighet.
        </p>
        <KontrollForm />
      </div>
    </main>
  );
}
