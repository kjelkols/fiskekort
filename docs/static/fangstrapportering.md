# Fremtidig utvidelse: Fangstrapportering på fiskekort

## Bakgrunn og behov
- Fangstrapportering gir rettighetshaver/statistikk over fangst (art, mengde, dato, sted)
- Kan brukes til rapportering til myndigheter eller forvaltning
- Øker brukerengasjement og gir merverdi for fiskeren
- Kan være pålagt i enkelte områder

## Mulig funksjonalitet
- Bruker kan registrere fangst på sitt fiskekort (art, vekt, lengde, dato, sted, bilde)
- Administrator kan hente ut fangstrapporter/statistikk
- Mulighet for anonymisert rapportering

## Teknisk løsning (skisse)
- Ny tabell: `fangst` med felter: id, fiskekort_id, art, vekt, lengde, dato, sted, bilde, opprettet
- Relasjon: Et fiskekort kan ha flere fangstrapporter
- Nye API-endepunkter for å legge til, hente og slette fangstrapporter
- Kan implementeres uten å endre eksisterende datamodell eller API vesentlig

## Anbefaling
- Ikke nødvendig i første versjon, men løsningen bør designes slik at dette enkelt kan legges til senere
- Dokumentet bør oppdateres og behov vurderes ved neste revisjon
