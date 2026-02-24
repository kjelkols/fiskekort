# Next.js + Headless CMS (Sanity) – Oppsett

Dette er et eksempel på hvordan du kan integrere Next.js med Sanity CMS for å la administratorer uten teknisk kunnskap redigere innhold via et webgrensesnitt. Kode og rammeverk holdes i Git-repoet, mens innholdet lagres i Sanity.

## 1. Opprett Sanity-prosjekt
- Gå til https://www.sanity.io/ og opprett en gratis konto.
- Opprett et nytt prosjekt og legg til ønskede "schemas" (f.eks. side, artikkel, bilde).
- Inviter administratorer som "editor".

## 2. Installer nødvendige pakker i Next.js-prosjektet
```sh
npm install @sanity/client @portabletext/react
```

## 3. Konfigurer Sanity-klient i Next.js
Opprett en fil `lib/sanity.js`:
```js
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2023-01-01',
  useCdn: true,
});
```

## 4. Hent og vis innhold i Next.js
Eksempel på å hente en side:
```js
import { sanity } from '../lib/sanity';

export async function getStaticProps() {
  const page = await sanity.fetch(`*[_type == "page" && slug.current == "forside"][0]`);
  return { props: { page } };
}

export default function Forside({ page }) {
  return <div>{page.title}</div>;
}
```

## 5. Miljøvariabler
Legg til i `.env.local`:
```
SANITY_PROJECT_ID=din_project_id
SANITY_DATASET=production
```

## 6. Deployment
- Next.js bygges og deployes som vanlig (f.eks. med Docker Compose).
- Innholdet hentes dynamisk fra Sanity.

## 7. Redigering av innhold
- Administrator logger inn på https://www.sanity.io/ og bruker det grafiske grensesnittet for å opprette og redigere sider, artikler, bilder osv.

---

Dette gir en løsning der kode og rammeverk holdes i Git, mens innholdet administreres trygt og enkelt i et eksternt CMS.