/**
 * app/fiskekort/kjop/page.tsx
 *
 * @route /fiskekort/kjop
 * @beskrivelse Gjestekjøp av fiskekort uten innlogging.
 * @auth ingen
 * @apiKall POST /api/betaling/checkout  (via useKjop.ts)
 *
 * Denne filen er kun en sideramme og inneholder ingen logikk.
 * Logikk: useKjop.ts  |  UI: KjopForm.tsx
 */

import KjopForm from "./KjopForm";
import { ORG } from "@/app-spec";

export const metadata = {
  title: `Kjøp fiskekort – ${ORG}`,
};

export default function KjopPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-blue-900">
          🎣 Kjøp fiskekort
        </h1>
        <KjopForm />
        <p className="mt-4 text-center text-xs text-gray-400">
          Sikker betaling via Stripe
        </p>
      </div>
    </main>
  );
}
