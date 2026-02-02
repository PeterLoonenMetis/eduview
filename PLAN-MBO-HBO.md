# Implementatieplan: MBO/HBO Onderwijstype Ondersteuning

## Samenvatting

Dit plan breidt EduView uit met ondersteuning voor zowel MBO als HBO onderwijstypes. Gebruikers kiezen bij het aanmaken van een opleiding het onderwijstype, waarna type-specifieke configuratie, terminologie en validatie worden toegepast.

---

## Fase 1: Database Schema Uitbreiding

### 1.1 Nieuwe Enums

```prisma
enum EducationType {
  MBO
  HBO
}

enum MBOLeerweg {
  BOL   // Beroeps Opleidende Leerweg
  BBL   // Beroeps Begeleidende Leerweg
}

enum MBONiveau {
  NIVEAU_1
  NIVEAU_2
  NIVEAU_3
  NIVEAU_4
}

enum MBOOntwerpprincipe {
  SCHOOL_PRIMAIR
  BPV_PRIMAIR
  HYBRIDE
}

enum HBOVariant {
  VOLTIJD
  DEELTIJD
  DUAAL
}

enum HBOToetsfilosofie {
  PROGRAMMATISCH
  TRADITIONEEL
}

enum HBOOrdeningsprincipe {
  PROJECTEN
  VRAAGSTUKKEN
  THEMAS
}

enum HBOTijdsnede {
  JAAR
  SEMESTER
  PERIODE
}
```

### 1.2 Program Model Uitbreiding

- Toevoegen `educationType` veld (default: HBO voor backwards compatibility)
- Toevoegen relaties naar `MBOConfig` en `HBOConfig` (one-to-one, optioneel)

### 1.3 Nieuwe MBO Modellen

**MBOConfig**
- `leerweg`: BOL of BBL
- `niveau`: 1-4
- `ontwerpprincipe`: School-primair, BPV-primair, Hybride
- `kdNaam`, `kdVersie`, `kdPeildatum`: Kwalificatiedossier info

**Kerntaak** (genest onder MBOConfig)
- `code`, `naam`, `beschrijving`
- Heeft meerdere `Werkprocessen`

**Werkproces** (genest onder Kerntaak)
- `code`, `naam`, `beschrijving`

**Keuzedeel** (genest onder MBOConfig)
- `code`, `naam`, `studiepunten`, `beschrijving`

### 1.4 Nieuwe HBO Modellen

**HBOConfig**
- `domein`: optioneel werkveld
- `variant`: Voltijd, Deeltijd, Duaal
- `toetsfilosofie`: Programmatisch of Traditioneel
- `ordeningsprincipe`: Projecten, Vraagstukken, Thema's
- `tijdsnede`: Jaar, Semester, Periode

---

## Fase 2: Validatie Schemas

### Nieuwe bestanden:
- `src/lib/validations/mbo-config.ts` - MBO configuratie validatie
- `src/lib/validations/hbo-config.ts` - HBO configuratie validatie

### Uitbreiding bestaand:
- `src/lib/validations/program.ts` - educationType veld + conditionele validatie

---

## Fase 3: Database Layer

### Nieuwe bestanden:
- `src/lib/db/mbo-config.ts` - CRUD voor MBOConfig, Kerntaak, Werkproces, Keuzedeel
- `src/lib/db/hbo-config.ts` - CRUD voor HBOConfig

### Uitbreiding bestaand:
- `src/lib/db/programs.ts` - Include mboConfig/hboConfig in queries

---

## Fase 4: Server Actions

### Nieuwe bestanden:
- `src/app/actions/mbo-config.ts` - Actions voor MBO configuratie
- `src/app/actions/hbo-config.ts` - Actions voor HBO configuratie

---

## Fase 5: Terminologie Systeem

### Nieuwe bestanden:
- `src/lib/education-types/index.ts` - Exports
- `src/lib/education-types/terminology.ts` - MBO vs HBO terminologie mapping
- `src/lib/education-types/mbo.ts` - MBO opties (leerweg, niveau, etc.)
- `src/lib/education-types/hbo.ts` - HBO opties (variant, toetsfilosofie, etc.)

### Context Provider:
- `src/lib/contexts/education-context.tsx` - React context voor onderwijstype

---

## Fase 6: UI Componenten

### Nieuwe componenten:
- `src/components/config/education-type-selector.tsx` - MBO/HBO keuze cards
- `src/components/config/education-wizard.tsx` - Wizard voor nieuwe opleiding
- `src/components/config/mbo-program-wizard.tsx` - MBO specifieke wizard stappen
- `src/components/config/hbo-program-wizard.tsx` - HBO specifieke wizard stappen
- `src/components/admin/program/mbo-config-form.tsx` - MBO configuratie formulier
- `src/components/admin/program/hbo-config-form.tsx` - HBO configuratie formulier

### Uitbreiding bestaand:
- `src/components/admin/program/program-form.tsx` - educationType selector toevoegen

---

## Fase 7: Nieuwe Pagina's

- `src/app/demo/nieuw/page.tsx` - Start wizard (kies MBO of HBO)
- `src/app/demo/nieuw/mbo/page.tsx` - MBO configuratie wizard
- `src/app/demo/nieuw/hbo/page.tsx` - HBO configuratie wizard

---

## Fase 8: Bestaande Componenten Aanpassen

- Layout: Wrap met EducationProvider wanneer opleiding geselecteerd is
- Sidebar: Gebruik terminologie uit context
- Curriculum pagina's: Labels aanpassen op basis van onderwijstype

---

## Implementatie Volgorde

| Stap | Onderdeel | Geschatte tijd |
|------|-----------|----------------|
| 1 | Schema uitbreiding + migratie | 30 min |
| 2 | Validatie schemas | 20 min |
| 3 | Database layer functies | 30 min |
| 4 | Server actions | 30 min |
| 5 | Terminologie systeem + context | 20 min |
| 6 | Education type selector component | 15 min |
| 7 | MBO config form + wizard | 45 min |
| 8 | HBO config form + wizard | 30 min |
| 9 | Nieuwe pagina's | 20 min |
| 10 | Program form uitbreiden | 15 min |
| 11 | Seed data updaten | 15 min |
| 12 | Testen + bugfixes | 30 min |

**Totaal: ~5 uur**

---

## Backwards Compatibility

- Bestaande programma's krijgen `educationType: HBO` als default
- Bij migratie wordt automatisch een `HBOConfig` aangemaakt voor bestaande programma's
- Alle bestaande functionaliteit blijft werken

---

## Te Maken Bestanden (Nieuw)

```
src/
├── lib/
│   ├── validations/
│   │   ├── mbo-config.ts
│   │   └── hbo-config.ts
│   ├── db/
│   │   ├── mbo-config.ts
│   │   └── hbo-config.ts
│   ├── education-types/
│   │   ├── index.ts
│   │   ├── terminology.ts
│   │   ├── mbo.ts
│   │   └── hbo.ts
│   └── contexts/
│       └── education-context.tsx
├── app/
│   ├── actions/
│   │   ├── mbo-config.ts
│   │   └── hbo-config.ts
│   └── demo/
│       └── nieuw/
│           ├── page.tsx
│           ├── mbo/
│           │   └── page.tsx
│           └── hbo/
│               └── page.tsx
└── components/
    └── config/
        ├── education-type-selector.tsx
        ├── education-wizard.tsx
        ├── mbo-program-wizard.tsx
        └── hbo-program-wizard.tsx
```

---

## Te Wijzigen Bestanden (Bestaand)

```
prisma/schema.prisma          - Nieuwe enums en modellen
prisma/seed.ts                - Demo data voor MBO/HBO
src/lib/validations/program.ts - educationType veld
src/lib/db/programs.ts        - Include configs
src/lib/db/index.ts           - Export nieuwe modules
src/components/admin/program/program-form.tsx - Type selector
```
