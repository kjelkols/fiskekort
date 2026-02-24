# Forslag til katalogstruktur for docs/

```
docs/
│
├── static/                  # Statiske dokumenter (manuelt vedlikeholdt)
│   ├── brukerveiledning.md  # Brukerveiledning for admin/sluttbruker
│   ├── kravspesifikasjon.md # Kravspesifikasjon
│   ├── wcag.md              # Tilgjengelighetskrav
│   ├── fangstrapportering.md# Fremtidig utvidelse: fangstrapportering
│   └── ...                  # Flere statiske kapitler
│
├── reference/               # Referansedokumenter (automatisk generert/oppdatert)
│   ├── api-openapi.json     # OpenAPI-spesifikasjon (fra backend)
│   ├── api-openapi.yaml     # OpenAPI-spesifikasjon (valgfritt, YAML)
│   ├── datamodell.md        # Datamodell (kan genereres fra ORM/schema)
│   └── ...                  # Andre referanser (f.eks. test-coverage, migrasjoner)
│
└── README.md                # Dokumentasjonens hovedside/innholdsfortegnelse
```

## Notater
- Alt i `static/` vedlikeholdes manuelt og kan redigeres fritt.
- Alt i `reference/` kan genereres eller oppdateres automatisk fra kode, database eller CI/CD.
- Dette gir ryddig skille mellom statisk og automatisk dokumentasjon, og gjør det enkelt å holde referanser oppdatert.
