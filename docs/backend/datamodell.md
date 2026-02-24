# Datamodell for Fiskekort-løsning

## Tabell: bruker
| Felt         | Type      | Krav     | Beskrivelse                | Eksponert i API |
|--------------|-----------|----------|----------------------------|-----------------|
| id           | UUID      | PK       | Unik bruker-ID             | ja              |
| navn         | tekst     | påkrevd  | Navn på bruker             | ja              |
| epost        | tekst     | påkrevd  | E-postadresse              | ja              |
| passord_hash | tekst     | påkrevd  | Hash av passord            | nei             |
| opprettet    | timestamp | auto     | Når brukeren ble opprettet | nei             |

## Tabell: fiskekort
| Felt         | Type      | Krav     | Beskrivelse                        | Eksponert i API |
|--------------|-----------|----------|------------------------------------|-----------------|
| id           | UUID      | PK       | Unik fiskekort-ID                  | ja              |
| bruker_id    | UUID      | FK       | Eier av fiskekortet (bruker.id)    | nei             |
| type         | tekst     | påkrevd  | Korttype (dagskort, ukeskort, etc) | ja              |
| redskap      | tekst     | påkrevd  | Fiskeredskap                       | ja              |
| gyldig_fra   | date      | påkrevd  | Startdato                          | ja              |
| gyldig_til   | date      | påkrevd  | Sluttdato                          | ja              |
| status       | tekst     | påkrevd  | aktiv, fremtidig, utgått           | ja              |
| qr_kode      | tekst     | påkrevd  | QR-kodeverdi                       | ja              |
| opprettet    | timestamp | auto     | Når kortet ble opprettet           | nei             |

## Tabell: betaling
| Felt         | Type      | Krav     | Beskrivelse                        | Eksponert i API |
|--------------|-----------|----------|------------------------------------|-----------------|
| id           | UUID      | PK       | Unik betaling-ID                   | ja              |
| fiskekort_id | UUID      | FK       | Tilhørende fiskekort (fiskekort.id)| nei             |
| metode       | tekst     | påkrevd  | vipps, stripe                      | ja              |
| status       | tekst     | påkrevd  | pending, fullført, feilet          | ja              |
| transaksjon  | tekst     |          | Transaksjons-ID fra leverandør     | nei             |
| opprettet    | timestamp | auto     | Når betalingen ble opprettet       | nei             |

## Relasjoner
- En bruker kan ha mange fiskekort
- Et fiskekort tilhører én bruker
- Et fiskekort kan ha én tilknyttet betaling

**Merk:** Kolonnen "Eksponert i API" viser hvilke felter som er tilgjengelige via API-et (jf. api-openapi.yaml). Database-spesifikke felter beholdes for intern bruk og drift.