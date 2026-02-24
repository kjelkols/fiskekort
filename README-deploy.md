# Fiskekort-app: Deployment-guide

Dette prosjektet bruker FastAPI (Python) som backend og PostgreSQL som database. Frontend kan bygges med React, Vue eller Svelte og serveres som statiske filer. Deployment skjer via Docker Compose for enkel oppstart på VPS.

## Forutsetninger
- Docker og Docker Compose installert
- Tilgang til en VPS med åpen port 80/443
- Git installert

## Steg-for-steg deployment

1. **Klon prosjektet fra GitHub**
   ```sh
   git clone https://github.com/dittbrukernavn/fiskekort-app.git
   cd fiskekort-app
   ```

2. **Kopier miljøvariabler**
   ```sh
   cp .env.example .env
   # Rediger .env og legg inn riktige verdier
   ```

3. **Start applikasjonen**
   ```sh
   docker-compose up -d
   ```

4. **(Valgfritt) Sett opp Nginx med Let's Encrypt**
   - Pek domenet til VPS-en
   - Bruk Nginx som reverse proxy for HTTPS
   - Se eksempel på nginx.conf i repoet

5. **Backup**
   - PostgreSQL-data lagres i en Docker volume (se docker-compose.yml)
   - Ta jevnlig backup av databasen, f.eks. med pg_dump:
     ```sh
     docker exec -t fiskekort-db pg_dump -U postgres brukernavn > backup.sql
     ```

## Oppdatering
- Pull siste endringer fra GitHub og restart med `docker-compose up -d`

## Miljøvariabler
Se `.env.example` for nødvendige variabler (database, Stripe/Vipps-nøkler, mm).

## Kontakt
For spørsmål, se README eller kontakt prosjektansvarlig.
