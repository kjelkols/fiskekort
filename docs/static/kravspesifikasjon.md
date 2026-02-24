# Kravspesifikasjon for Fiskekort-løsning

## 1. Teknisk arkitektur
- Backend: FastAPI (Python)
- Database: PostgreSQL
- Frontend: Next.js (React)
- Innholdshåndtering: Sanity (headless CMS)
- QR-kode-generering: Integrert i backend
- Deployment: Docker Compose, Nginx med Let's Encrypt
- Kode og rammeverk i Git-repo, innhold lagres eksternt

## 2. Bruker- og administratoropplevelse
- Administrator kan redigere og publisere innhold via Sanity
- Installasjon og oppsett skal kunne gjennomføres av ikke-tekniske brukere med AI-støtte og tydelige guider

## 3. Betalingsløsninger
- Vipps for norske brukere
- Stripe for kort og internasjonale brukere
- Kostnader og gebyrer beskrevet i betalingsintegrasjon.md

## 4. Backup og gjenoppretting
- Det skal være enkelt for administrator å ta backup og gjenopprette aktive og fremtidige fiskekort
- Backup skal kunne lastes ned og gjenopprettes uten teknisk kompetanse

## 5. Tilgjengelighet (WCAG)
- Nettsiden og admin-grensesnittet skal følge WCAG 2.1 AA-standard
- God kontrast, tastaturnavigasjon, alt-tekst, semantisk HTML, støtte for skjermlesere

## 6. Personvern og GDPR
- Rutiner for sletting og eksport av brukerdata
- Ingen sensitive data lagres uten samtykke

## 7. Dokumentasjon
- Brukerveiledning for administrator og sluttbruker
- Installasjonsguide for VPS

## 8. Drift og oppdatering
- Enkel selv-deployment på VPS
- Backup-rutiner for database
- Mulighet for automatisert oppdatering og vedlikehold

## 9. Skalerbarhet
- Ikke prioritert nå, men arkitektur skal kunne utvides ved behov

---

Denne kravspesifikasjonen oppsummerer alle avklarte punkter og gir et tydelig grunnlag for videre utvikling.