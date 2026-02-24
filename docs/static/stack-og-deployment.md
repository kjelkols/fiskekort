# Forslag til teknisk stack og deployment-oppsett

## Teknisk stack

### Backend
- **Node.js** med **Express**
- Alternativ: **Python** med **FastAPI**

### Frontend
- **React** (CRA eller Vite for enkel bygging)
- Alternativ: **Vue** eller **Svelte**

### Database
- **SQLite** (filbasert, enkel å sette opp)
- Alternativ: **PostgreSQL** (for større skala)

### QR-kode-generering
- **npm-pakke:** `qrcode` (Node.js)

### Betaling
- **Stripe** (kort og internasjonalt)
- **Vipps** (for norske brukere)

### Deployment
- **Docker Compose** for enkel oppstart av backend, frontend og database
- **Nginx** som reverse proxy og for HTTPS (Let’s Encrypt)

---

## Eksempel på deployment-oppsett

1. **Klon repo fra GitHub**
2. **Kopier .env.example til .env og fyll inn nødvendige variabler**
3. **Kjør `docker-compose up -d`**
4. **Nginx konfigureres for å peke til backend og frontend**
5. **Let’s Encrypt brukes for gratis SSL**

Dette gir en løsning som er enkel å deploye på VPS, og som andre kan kopiere og bruke på egen server.