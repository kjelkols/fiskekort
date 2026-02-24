/**
 * app/page.tsx
 *
 * @route /
 * @beskrivelse Landingsside for Øvre Gloppen Elveeigarlag.
 * @auth ingen
 * @apiKall ingen
 *
 * Server-komponent – ingen "use client" nødvendig.
 */

import Link from "next/link";
import { ORG, KORTTYPER } from "@/app-spec";

export default function Forside() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 bg-blue-50">
      {/* Hero */}
      <section className="mb-12 text-center max-w-lg">
        <h1 className="text-4xl font-bold text-blue-900 mb-3 leading-tight">
          🎣 {ORG}
        </h1>
        <p className="text-lg text-gray-600">
          Kjøp fiskekort raskt og enkelt — ingen konto nødvendig.
          QR-koden er klar med én gang betalingen er gjennomført.
        </p>
      </section>

      {/* Korttyper – oversikt */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        {KORTTYPER.map((k) => (
          <div
            key={k.verdi}
            className="rounded-2xl bg-white shadow border border-blue-100 p-5 text-center"
          >
            <p className="font-semibold text-blue-900">{k.label}</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{k.pris}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/fiskekort/kjop"
          className="rounded-xl bg-blue-700 px-8 py-3 text-white font-semibold hover:bg-blue-800 transition-colors shadow"
        >
          Kjøp fiskekort
        </Link>
        <Link
          href="/kontroll"
          className="rounded-xl border-2 border-blue-700 px-8 py-3 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
        >
          Kontroller QR-kode
        </Link>
      </div>
    </main>
  );
}
