# Forslag til katalogstruktur for prosjektet

```
/ (rot)
│
├── backend/                # FastAPI-backend
│   ├── app/                # Applikasjonskode
│   ├── tests/              # Tester for backend
│   ├── requirements.txt    # Python-avhengigheter
│   └── README.md           # Backend-dokumentasjon
│
├── frontend/               # Next.js frontend
│   ├── src/                # Kildekode for frontend
│   ├── tests/              # Tester for frontend
│   ├── public/             # Statisk innhold
│   └── README.md           # Frontend-dokumentasjon
│
├── docs/                   # Dokumentasjon (API, brukerveiledning, referansemanual)
│   ├── api-reference.md    # API-dokumentasjon (OpenAPI/Swagger)
│   ├── brukerveiledning.md # Brukerveiledning for admin/sluttbruker
│   ├── kravspesifikasjon.md# Kravspesifikasjon
│   ├── wcag.md             # Tilgjengelighetskrav
│   └── ...                 # Flere kapitler etter behov
│
├── docker-compose.yml      # Oppsett for hele systemet
├── .env.example            # Eksempel på miljøvariabler
└── README.md               # Prosjektets hoveddokumentasjon
```

## Notater
- Dokumentasjonen i `docs/` skal være modulær og kunne genereres til PDF (f.eks. med pandoc).
- API-dokumentasjon skal være tydelig og oppdatert, gjerne generert automatisk fra backend.
- Tester skal ligge i egne `tests/`-mapper for både backend og frontend.
- Frontend og backend er fullstendig separert, med egne README-filer og avhengigheter.

Denne strukturen gir god oversikt, enkel testing og vedlikehold, og legger til rette for profesjonell dokumentasjon.

## Automatisk eksport av OpenAPI-spesifikasjon

FastAPI genererer alltid oppdatert OpenAPI-spesifikasjon på `/openapi.json`. For å holde dokumentasjonen oppdatert kan du bruke et enkelt script for å lagre denne til `docs/api-openapi.json` (og eventuelt YAML):

Eksempel (bash):
```sh
# Eksporter OpenAPI JSON
curl http://localhost:8000/openapi.json -o docs/api-openapi.json

# (Valgfritt) Konverter til YAML hvis ønskelig
pip install -q pyyaml
python -c 'import sys, yaml, json; yaml.safe_dump(json.load(sys.stdin), sys.stdout)' < docs/api-openapi.json > docs/api-openapi.yaml
```

I de fleste tilfeller holder det med JSON, siden de fleste verktøy og UI-er (Swagger, Redoc) bruker dette. YAML kan være nyttig for lesbarhet eller hvis du skal bruke dokumentasjonen i andre systemer som krever YAML.

Med dette scriptet trengs ikke en egen api-reference.md – dokumentasjonen er alltid oppdatert og konsis.