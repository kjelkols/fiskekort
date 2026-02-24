# Frontend-arkitektur

## Teknisk stack

- **Rammeverk:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **API-kommunikasjon:** `lib/api.ts` (native `fetch`)
- **PDF-nedlasting:** `window.print()` med `@media print` i `globals.css`
- **QR-kode:** `react-qr-code`

---

## Katalogstruktur

```
frontend/
  app-spec.ts              ← Maskinlesbar appspesifikasjon (start her)
  lib/
    api.ts                 ← Alle API-typer og fetch-funksjoner
    auth.ts                ← JWT-token helpers (localStorage)
  components/
    FiskekortKort.tsx      ← Gjenbrukbart fiskekort-kort (QR + detaljer + PDF)
  app/
    globals.css            ← Tailwind-base, .input-komponent, print-regler
    layout.tsx             ← Root-layout, metadata
    page.tsx               ← Forside (server-komponent)
    fiskekort/kjop/
      page.tsx             ← Sideramme (~20 linjer, ingen logikk)
      KjopForm.tsx         ← UI-markup (ingen logikk)
      useKjop.ts           ← Tilstand + forretningsregler
    fiskekort/bekreftelse/
      page.tsx             ← Sideramme + Suspense-innpakking
      useBekreftelse.ts    ← Polling-logikk
    kontroll/
      page.tsx             ← Sideramme
      KontrollForm.tsx     ← UI-markup
      useKontroll.ts       ← Tilstand + API-kall
```

---

## Lagdelingsmodell

Hver side er delt i **tre separate lag**:

| Lag | Fil | Innhold |
|---|---|---|
| **Sideramme** | `page.tsx` | Layout, metadata, monterer form-komponenten |
| **UI** | `*Form.tsx` / `FiskekortKort.tsx` | JSX-markup, ingen tilstand eller logikk |
| **Logikk** | `use*.ts` | `useState`, API-kall, forretningsregler |

> **Regel:** Vil du endre utseende → endre kun `*Form.tsx`.  
> Vil du endre en forretningsregel → endre kun `use*.ts`.  
> Vil du forstå hva en side gjør → les kun `page.tsx`.

---

## app-spec.ts

Filen `app-spec.ts` i rotkatalogen er den sentrale spesifikasjonen for hele applikasjonen.
Den eksporterer:

- **`ORG`** – Organisasjonsnavn (brukes i layout, fiskekort-kort og metadata)
- **`KORTTYPER`** – Gyldige korttyper med priser (brukes i UI og prisberegning)
- **`REDSKAP`** – Gyldige redskapstyper
- **`RUTER`** – Alle sider med beskrivelse, auth-krav, API-kall og forretningsregler

Alle komponenter og hooks importerer konstanter herfra — ingenting hardkodes andre steder.
Les `app-spec.ts` før du gjør endringer i applikasjonen.

---

## Sider

### `/` – Forside
- Server-komponent (ingen `"use client"`)
- Viser organisasjonsnavn, korttyper med priser og CTA-knapper
- Ingen API-kall

### `/fiskekort/kjop` – Kjøp fiskekort
- Gjestekjøp uten innlogging
- Forretningsregler i `useKjop.ts`:
  - Dagskort: `gyldig_til` settes automatisk lik `gyldig_fra`
  - `gyldig_til >= gyldig_fra` valideres før innsending
- Kaller `POST /api/betaling/checkout` → redirect til Stripe Checkout

### `/fiskekort/bekreftelse` – Etter betaling
- Mottar `?betaling_id=` fra URL (lagt til av Stripe success_url)
- Poller `GET /api/betaling/{id}` hvert 3. sekund inntil `betaling_status === "fullført"`
- Maks 20 forsøk (60 sekunder), deretter feilmelding
- Viser `FiskekortKort`-komponenten med QR-kode og detaljer
- "Last ned PDF"-knapp bruker `window.print()` — kun `#fiskekort-print` skrives ut

### `/kontroll` – Oppsynsmann QR-sjekk
- Manuell innskriving av UUID fra QR-koden
- Koden normaliseres (trim + lowercase) i `useKontroll.ts`
- Kaller `GET /api/kontroll/qr/{kode}`
- Viser grønn (gyldig) eller rød (ugyldig) resultat-boks med kortdetaljer

---

## lib/api.ts

Alle serverforespørsler er samlet i én fil. Ingen `fetch`-kall utenfor denne filen.

| Funksjon | Metode | Endepunkt | Auth |
|---|---|---|---|
| `initierCheckout` | POST | `/api/betaling/checkout` | Ingen |
| `getBetalingStatus` | GET | `/api/betaling/{id}` | Ingen |
| `kontrollerQR` | GET | `/api/kontroll/qr/{kode}` | Ingen |
| `loggInn` | POST | `/api/auth/login` | – |

---

## PDF-nedlasting

PDF-funksjonaliteten er implementert uten eksterne biblioteker:

1. `globals.css` definerer `@media print` som skjuler alt unntatt `#fiskekort-print`
2. `FiskekortKort.tsx` setter `id="fiskekort-print"` på rot-elementet
3. "Last ned PDF"-knappen kaller `window.print()`

Brukeren kan velge "Lagre som PDF" i nettleserens utskriftsdialog.

---

## Fremtidige utvidelser

Planlagte sider (ikke implementert):

- `/min-side` – Innlogget bruker: mine kort + fangstrapport
- `/admin` – Administrasjonspanel

Autentisering: `lib/auth.ts` er klar med `getToken`, `setToken`, `clearToken` og `authHeaders`.
