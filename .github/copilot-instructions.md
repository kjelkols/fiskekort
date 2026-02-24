# Copilot Instructions for Fiskekort

## Generelle regler
- Spør alltid om godkjenning før du kjører kommandoer i terminalen.
- Alle md-dokumenter skal alltid ligge under `docs/` eller underkataloger av `docs/`.
- Ikke lag unødvendige md-filer for å dokumentere endringer, med mindre brukeren ber om det.

## Python
- Bruk alltid `uv` for å installere Python-pakker og kjøre FastAPI-prosjekter.
- Bruk virtuelle miljøer med `uv venv` og aktiver med `source .venv/bin/activate`.
- Bruk `Alembic` for alle database-migreringer i backend.
- Bruk `SQLAlchemy` som ORM.

## Katalogstruktur
- Backend-kode ligger i `backend/`
- Frontend-kode ligger i `frontend/`
- Dokumentasjon ligger i `docs/` med underkatalogene:
  - `docs/static/` – statiske, manuelle dokumenter
  - `docs/backend/` – backend-referansedokumentasjon
  - `docs/frontend/` – frontend-referansedokumentasjon
  - `docs/api/` – automatisk generert API-dokumentasjon (OpenAPI/YAML)
  - `docs/integrations/` – dokumentasjon for eksterne integrasjoner

## Teknisk stack
- Backend: FastAPI (Python) med uv
- Database: PostgreSQL
- Frontend: Next.js (React)
- CMS: Sanity (headless)
- Betaling: Vipps og Stripe
- Deployment: Docker Compose, Nginx, Let's Encrypt

## Testing
- Tester for backend ligger i `backend/tests/`
- Tester for frontend ligger i `frontend/tests/`
