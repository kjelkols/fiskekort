/**
 * app/fiskekort/kjop/KjopForm.tsx
 *
 * UI-komponent for kjøpsskjemaet. Inneholder INGEN logikk eller state.
 * All tilstand og forretningslogikk lever i useKjop.ts.
 *
 * Strukturen:
 *   1. Kontaktinfo (navn + e-post)
 *   2. Korttype-velger
 *   3. Redskap-velger
 *   4. Datovelger (gyldig fra / til)
 *   5. Send-knapp
 */

"use client";

import { useKjop, KORTTYPER, REDSKAP } from "./useKjop";
import type { Korttype, Redskap } from "@/app-spec";

export default function KjopForm() {
  const {
    navn, epost, type, redskap, gyldigFra, gyldigTil, laster, feil,
    setNavn, setEpost, setType, setRedskap, setGyldigFra, setGyldigTil,
    handleSubmit,
  } = useKjop();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* 1. Kontaktinfo */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-gray-700 mb-1">
          Kontaktinformasjon
        </legend>
        <input
          type="text"
          placeholder="Fullt navn"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="E-postadresse"
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
          required
          className="input"
        />
      </fieldset>

      {/* 2. Korttype */}
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Korttype</p>
        <div className="flex gap-3">
          {KORTTYPER.map((k) => (
            <button
              key={k.verdi}
              type="button"
              onClick={() => setType(k.verdi as Korttype)}
              className={`flex-1 rounded-xl border-2 py-2 text-sm font-semibold transition-colors ${
                type === k.verdi
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-200 text-gray-700 hover:border-blue-400"
              }`}
            >
              <div>{k.label}</div>
              <div className="text-xs opacity-75">{k.pris}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Redskap */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Redskap
        </label>
        <select
          value={redskap}
          onChange={(e) => setRedskap(e.target.value as Redskap)}
          className="input"
        >
          {REDSKAP.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* 4. Datoer */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Gyldig fra
          </label>
          <input
            type="date"
            value={gyldigFra}
            onChange={(e) => setGyldigFra(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Gyldig til
          </label>
          <input
            type="date"
            value={gyldigTil}
            min={gyldigFra}
            disabled={type === "dagskort"}
            onChange={(e) => setGyldigTil(e.target.value)}
            required
            className="input disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>
      </div>

      {/* Feilmelding */}
      {feil && (
        <p role="alert" className="text-sm text-red-600">
          {feil}
        </p>
      )}

      {/* 5. Send */}
      <button
        type="submit"
        disabled={laster}
        className="rounded-xl bg-blue-700 py-3 text-white font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
      >
        {laster ? "Sender til betaling…" : "Betal med kort →"}
      </button>
    </form>
  );
}
