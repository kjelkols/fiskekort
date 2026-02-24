/**
 * app-spec.ts
 *
 * Maskinlesbar applikasjonsspesifikasjon for Øvre Gloppen Elveeigarlag Fiskekort.
 *
 * Les denne filen for oversikt over ruter, API-kall og forretningsregler
 * FØR du gjør endringer i applikasjonen. Filen importeres av andre moduler
 * slik at regler og konstanter aldri dupliseres.
 *
 * Struktur:
 *   ORG          – Organisasjonsnavn
 *   KORTTYPER    – Gyldige korttyper med priser
 *   REDSKAP      – Gyldige redskapstyper
 *   RUTER        – Alle sider med beskrivelse, auth-krav, API-kall og regler
 */

// ---------------------------------------------------------------------------
// Organisasjon
// ---------------------------------------------------------------------------

export const ORG = "Øvre Gloppen Elveeigarlag";

// ---------------------------------------------------------------------------
// Forretningsdata – bruk disse overalt, ikke hardkod verdier i komponenter
// ---------------------------------------------------------------------------

export const KORTTYPER = [
  { verdi: "dagskort",   label: "Dagskort",   pris: "150 kr", prisOere: 15000 },
  { verdi: "ukeskort",   label: "Ukeskort",   pris: "400 kr", prisOere: 40000 },
  { verdi: "sesongkort", label: "Sesongkort", pris: "800 kr", prisOere: 80000 },
] as const;

export type Korttype = (typeof KORTTYPER)[number]["verdi"];

export const REDSKAP = ["Stang", "Garn", "Oter", "Ruse", "Håv"] as const;

export type Redskap = (typeof REDSKAP)[number];

// ---------------------------------------------------------------------------
// Ruter
// ---------------------------------------------------------------------------

export const RUTER = {

  forside: {
    path: "/",
    beskrivelse: "Landingsside – informasjon om elvelaget og CTA til kjøp av fiskekort",
    auth: "ingen",
    apiKall: [],
    komponenter: ["app/page.tsx"],
  },

  kjop: {
    path: "/fiskekort/kjop",
    beskrivelse: "Gjestekjøp av fiskekort uten innlogging. Sender brukeren til Stripe Checkout.",
    auth: "ingen",
    apiKall: ["POST /api/betaling/checkout"],
    inputs: ["navn: string", "epost: EmailStr", "type: Korttype", "redskap: Redskap", "gyldig_fra: date", "gyldig_til: date"],
    output: "Redirect til Stripe Checkout URL. betaling_id legges i sessionStorage.",
    regler: [
      "gyldig_til >= gyldig_fra (valideres i useKjop.ts)",
      "Dagskort: gyldig_fra === gyldig_til settes automatisk",
    ],
    komponenter: [
      "app/fiskekort/kjop/page.tsx        – sideramme (ingen logikk)",
      "app/fiskekort/kjop/KjopForm.tsx    – UI-komponent (ingen logikk)",
      "app/fiskekort/kjop/useKjop.ts      – tilstand + forretningslogikk",
    ],
  },

  bekreftelse: {
    path: "/fiskekort/bekreftelse",
    beskrivelse: "Viser ferdig fiskekort med QR-kode etter betaling. Støtter PDF-nedlasting (window.print).",
    auth: "ingen",
    apiKall: ["GET /api/betaling/{betaling_id}"],
    inputs: ["betaling_id: UUID (URL query-param ?betaling_id=...)"],
    output: "Fiskekort-kort med QR-kode, detaljer og Last ned PDF-knapp",
    regler: [
      "Poll GET /api/betaling/{id} hvert 3. sek inntil betaling_status === 'fullført'",
      "Maks 20 forsøk (60 sek totalt), deretter vis feilmelding",
      "QR-kode-verdi = fiskekort.qr_kode (UUID)",
    ],
    komponenter: [
      "app/fiskekort/bekreftelse/page.tsx         – sideramme",
      "app/fiskekort/bekreftelse/useBekreftelse.ts – polling + tilstand",
      "components/FiskekortKort.tsx                – visuelt kort (gjenbrukbar)",
    ],
  },

  kontroll: {
    path: "/kontroll",
    beskrivelse: "Oppsynsmann sjekker gyldighet av fiskekort via QR-kode (UUID) eller manuell innskriving.",
    auth: "ingen",
    apiKall: ["GET /api/kontroll/qr/{kode}"],
    inputs: ["kode: UUID (fra QR-kode eller manuell innskriving)"],
    output: "Gyldig (grønn) / Ugyldig (rød) med kortdetaljer",
    regler: [
      "kode strippes for whitespace og gjøres lowercase før API-kall",
      "API returnerer { gyldig: bool, status, type, redskap, gyldig_fra, gyldig_til }",
    ],
    komponenter: [
      "app/kontroll/page.tsx           – sideramme",
      "app/kontroll/KontrollForm.tsx   – UI-komponent",
      "app/kontroll/useKontroll.ts     – tilstand + api-kall",
    ],
  },

} as const;
