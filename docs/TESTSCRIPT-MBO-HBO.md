# EduView MBO/HBO Configuratie - Testscript

**Versie:** 1.0
**Datum:** 31 januari 2026
**Applicatie:** EduView (Demo)
**Scope:** MBO/HBO Startconfiguratie + Bestaande Flow Integriteit

---

## Inhoudsopgave

1. [Testomgeving & Precondities](#testomgeving--precondities)
2. [Testmatrix Overzicht](#testmatrix-overzicht)
3. [Feature A: Startconfiguratie](#feature-a-startconfiguratie)
4. [Feature B: MBO Validaties](#feature-b-mbo-validaties)
5. [Feature C: HBO Validaties](#feature-c-hbo-validaties)
6. [Feature D: Flow-integriteit](#feature-d-flow-integriteit)
7. [Feature E: Persistency & Navigatie](#feature-e-persistency--navigatie)
8. [Feature F: Basis Kwaliteitschecks](#feature-f-basis-kwaliteitschecks)
9. [Regressietesten](#regressietesten)
10. [Release Checklist](#release-checklist)

---

## Testomgeving & Precondities

### Omgeving
- **URL:** http://localhost:3000
- **Browser:** Chrome (laatste versie), Firefox, Safari
- **Database:** SQLite met seed data

### Precondities voor alle testen
1. Database is geseeded met `npm run db:seed`
2. Development server draait op poort 3000
3. Minimaal 1 academie bestaat (HBO: "School of Technology", MBO: "MBO College ICT")
4. Bestaande demo-opleidingen: HBO-ICT, Applicatieontwikkelaar (MBO)

### Testdata
| Veld | HBO Waarde | MBO Waarde |
|------|------------|------------|
| Naam | Test Opleiding HBO | Test Opleiding MBO |
| Code | THBO | TMBO |
| CROHO | 99999 | - |
| Duur | 4 jaar | 4 jaar |
| EC/SBU | 240 EC | 0 (n.v.t.) |

---

## Testmatrix Overzicht

### Feature A: Startconfiguratie

| ID | Scenario | Expected Result | Status |
|----|----------|-----------------|--------|
| TC-A01 | Onderwijstype selectie: HBO kiezen | Doorgaan naar HBO wizard | ☐ |
| TC-A02 | Onderwijstype selectie: MBO kiezen | Doorgaan naar MBO wizard | ☐ |
| TC-A03 | HBO wizard: correcte velden getoond | Alle HBO-specifieke velden zichtbaar | ☐ |
| TC-A04 | MBO wizard: correcte velden getoond | Alle MBO-specifieke velden zichtbaar | ☐ |
| TC-A05 | Configuratie opslaan HBO | Program + HBOConfig aangemaakt | ☐ |
| TC-A06 | Configuratie opslaan MBO | Program + MBOConfig aangemaakt | ☐ |
| TC-A07 | Terminologie HBO | EC, leeruitkomst, toets labels | ☐ |
| TC-A08 | Terminologie MBO | SBU, werkproces, PvB labels | ☐ |

### Feature B: MBO Validaties

| ID | Scenario | Expected Result | Status |
|----|----------|-----------------|--------|
| TC-B01 | Leerweg leeg | Foutmelding, form niet verzonden | ☐ |
| TC-B02 | Duur = 0 | Foutmelding, minimaal 1 jaar | ☐ |
| TC-B03 | Opleidingsnaam leeg | Foutmelding, verplicht veld | ☐ |
| TC-B04 | Code leeg | Foutmelding, verplicht veld | ☐ |
| TC-B05 | Geldige MBO invoer | Opleiding succesvol aangemaakt | ☐ |

### Feature C: HBO Validaties

| ID | Scenario | Expected Result | Status |
|----|----------|-----------------|--------|
| TC-C01 | Opleidingsnaam leeg | Foutmelding, verplicht veld | ☐ |
| TC-C02 | Code leeg | Foutmelding, verplicht veld | ☐ |
| TC-C03 | Totaal EC = 0 | Foutmelding of default waarde | ☐ |
| TC-C04 | Variant niet geselecteerd | Foutmelding of default | ☐ |
| TC-C05 | Toetsfilosofie niet geselecteerd | Foutmelding of default | ☐ |
| TC-C06 | Ordeningsprincipe niet geselecteerd | Foutmelding of default | ☐ |
| TC-C07 | Geldige HBO invoer | Opleiding succesvol aangemaakt | ☐ |
| TC-C08 | EC niet deelbaar door 30 | Waarschuwing of foutmelding | ☐ |

### Feature D: Flow-integriteit

| ID | Scenario | Expected Result | Status |
|----|----------|-----------------|--------|
| TC-D01 | Na config → Richtinggevende kaders | Navigatie naar visie mogelijk | ☐ |
| TC-D02 | Na config → Grof curriculum | Navigatie naar curriculum overzicht | ☐ |
| TC-D03 | Na config → Fijn curriculum | Navigatie naar blokdetail | ☐ |
| TC-D04 | HBO: Labels volgens ordeningsprincipe | Correcte terminologie in UI | ☐ |
| TC-D05 | MBO: KD-koppelingen zichtbaar | Kerntaken/werkprocessen getoond | ☐ |
| TC-D06 | HBO Programmatisch: correcte concepten | Bewijslast, feedback, beslismomenten | ☐ |
| TC-D07 | HBO Traditioneel: correcte concepten | Toetsmoment, weging, herkansing | ☐ |

### Feature E: Persistency & Navigatie

| ID | Scenario | Expected Result | Status |
|----|----------|-----------------|--------|
| TC-E01 | Refresh behoud configuratie | Opleiding nog steeds zichtbaar | ☐ |
| TC-E02 | Terug naar opleidingenlijst | Opleiding in lijst met badge | ☐ |
| TC-E03 | Bewerk opleiding | Config sectie uitklapbaar | ☐ |

### Feature F: Basis Kwaliteit

| ID | Scenario | Expected Result | Status |
|----|----------|-----------------|--------|
| TC-F01 | Form error states zichtbaar | Rode border + foutmelding | ☐ |
| TC-F02 | Console errors normale flow | Geen errors in console | ☐ |
| TC-F03 | Laadtijd configuratiescherm | < 3 seconden | ☐ |

---

## Feature A: Startconfiguratie

### TC-A01: Onderwijstype selectie - HBO kiezen

**Doel:** Verifieer dat gebruiker HBO kan selecteren en doorgaat naar HBO wizard

**Precondities:**
- Gebruiker is op startpagina of beheer

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar `/demo/nieuw` | Keuze scherm MBO/HBO wordt getoond |
| 2 | Klik op "HBO" kaart | HBO kaart krijgt selectie-indicator |
| 3 | Klik op "HBO opleiding starten" knop | Redirect naar `/demo/nieuw/hbo` |
| 4 | Verifieer pagina | HBO wizard met stap 2 (Basis) getoond |

**Acceptatiecriteria:**
- [x] MBO en HBO kaarten zijn duidelijk zichtbaar
- [x] Geselecteerde kaart heeft visuele feedback (teal kleur)
- [x] Juiste redirect naar HBO wizard
- [x] Progress indicator toont stap 1 als completed

---

### TC-A02: Onderwijstype selectie - MBO kiezen

**Doel:** Verifieer dat gebruiker MBO kan selecteren en doorgaat naar MBO wizard

**Precondities:**
- Gebruiker is op startpagina of beheer

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar `/demo/nieuw` | Keuze scherm MBO/HBO wordt getoond |
| 2 | Klik op "MBO" kaart | MBO kaart krijgt selectie-indicator |
| 3 | Klik op "MBO opleiding starten" knop | Redirect naar `/demo/nieuw/mbo` |
| 4 | Verifieer pagina | MBO wizard met stap 2 (Basis) getoond |

**Acceptatiecriteria:**
- [x] MBO kaart heeft blauwe kleur
- [x] Geselecteerde kaart heeft visuele feedback
- [x] Juiste redirect naar MBO wizard
- [x] Progress indicator toont stap 1 als completed

---

### TC-A03: HBO wizard - correcte velden getoond

**Doel:** Verifieer dat alle HBO-specifieke velden aanwezig zijn

**Precondities:**
- Gebruiker is op `/demo/nieuw/hbo`

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Bekijk stap 2 (Basis) | Velden: Academie, Naam, Code, CROHO, Domein, Type diploma, Duur, EC |
| 2 | Klik "Volgende stap" | Stap 3 (Configuratie) wordt getoond |
| 3 | Bekijk stap 3 | Velden: Variant, Toetsfilosofie, Ordeningsprincipe, Tijdsnede |

**Acceptatiecriteria:**
- [x] Academie dropdown bevat beschikbare academies
- [x] Type diploma: Bachelor, Master, Associate Degree opties
- [x] Variant: Voltijd, Deeltijd, Duaal
- [x] Toetsfilosofie: Programmatisch, Traditioneel
- [x] Ordeningsprincipe: Projecten, Vraagstukken, Thema's
- [x] Tijdsnede: Jaar, Semester, Periode
- [x] Uitleg tekst bij toetsfilosofie aanwezig

---

### TC-A04: MBO wizard - correcte velden getoond

**Doel:** Verifieer dat alle MBO-specifieke velden aanwezig zijn

**Precondities:**
- Gebruiker is op `/demo/nieuw/mbo`

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Bekijk stap 2 (Basis) | Velden: Academie, Naam, Code, Niveau, Opleidingsduur |
| 2 | Klik "Volgende stap" | Stap 3 (Configuratie) wordt getoond |
| 3 | Bekijk stap 3 | Velden: Leerweg, Ontwerpprincipe, KD-naam, KD-versie, Peildatum |

**Acceptatiecriteria:**
- [x] Academie dropdown bevat beschikbare academies
- [x] Niveau: 1, 2, 3, 4
- [x] Leerweg: BOL, BBL met uitleg
- [x] Ontwerpprincipe: School-primair, BPV-primair, Hybride
- [x] Kwalificatiedossier sectie is optioneel

---

### TC-A05: HBO opleiding aanmaken

**Doel:** Verifieer dat HBO opleiding correct wordt opgeslagen

**Precondities:**
- Gebruiker is op `/demo/nieuw/hbo`

**Testdata:**
```
Academie: School of Technology (SOT)
Naam: Technische Informatica
Code: TI
CROHO: 34476
Domein: Techniek
Type: Bachelor
Duur: 4 jaar
EC: 240
Variant: Voltijd
Toetsfilosofie: Traditioneel
Ordeningsprincipe: Thema's
Tijdsnede: Semester
```

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Vul alle velden in stap 2 | Geen validatiefouten |
| 2 | Klik "Volgende stap" | Stap 3 wordt getoond |
| 3 | Vul alle velden in stap 3 | Geen validatiefouten |
| 4 | Klik "Opleiding aanmaken" | Loading indicator getoond |
| 5 | Wacht op redirect | Redirect naar `/demo/beheer/opleidingen/[id]` |
| 6 | Verifieer opleiding | HBO badge, config sectie aanwezig |

**Acceptatiecriteria:**
- [x] Opleiding verschijnt in opleidingenlijst
- [x] HBO badge (teal) is zichtbaar
- [x] HBOConfig is aangemaakt (uitklapbare sectie)
- [x] Alle ingevoerde waarden zijn correct opgeslagen

---

### TC-A06: MBO opleiding aanmaken

**Doel:** Verifieer dat MBO opleiding correct wordt opgeslagen

**Precondities:**
- Gebruiker is op `/demo/nieuw/mbo`

**Testdata:**
```
Academie: MBO College ICT (MCT)
Naam: Software Developer
Code: SD
Niveau: 4
Duur: 3 jaar
Leerweg: BOL
Ontwerpprincipe: Hybride
KD-naam: Software Development
KD-versie: 2024
```

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Vul alle velden in stap 2 | Geen validatiefouten |
| 2 | Klik "Volgende stap" | Stap 3 wordt getoond |
| 3 | Vul alle velden in stap 3 | Geen validatiefouten |
| 4 | Klik "Opleiding aanmaken" | Loading indicator getoond |
| 5 | Wacht op redirect | Redirect naar `/demo/beheer/opleidingen/[id]` |
| 6 | Verifieer opleiding | MBO badge, config sectie aanwezig |

**Acceptatiecriteria:**
- [x] Opleiding verschijnt in opleidingenlijst
- [x] MBO badge (blauw) is zichtbaar
- [x] MBOConfig is aangemaakt (uitklapbare sectie)
- [x] Kerntaken kunnen later worden toegevoegd

---

### TC-A07: Terminologie HBO

**Doel:** Verifieer dat HBO terminologie correct wordt getoond

**Precondities:**
- HBO opleiding bestaat (HBO-ICT)

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar HBO opleiding | Detail pagina getoond |
| 2 | Bekijk credits label | "240 EC" getoond (niet SBU) |
| 3 | Navigeer naar curriculum | "Leeruitkomsten" als term |
| 4 | Bekijk toetsing (indien aanwezig) | "Toets" als term |

**Acceptatiecriteria:**
- [x] EC (Studiepunten) i.p.v. SBU
- [x] Leeruitkomst i.p.v. Werkproces
- [x] Toets i.p.v. Proeve van bekwaamheid

---

### TC-A08: Terminologie MBO

**Doel:** Verifieer dat MBO terminologie correct wordt getoond

**Precondities:**
- MBO opleiding bestaat (Applicatieontwikkelaar)

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar MBO opleiding | Detail pagina getoond |
| 2 | Bekijk config sectie | Kerntaken, werkprocessen |
| 3 | Bekijk labels | MBO-specifieke termen |

**Acceptatiecriteria:**
- [x] SBU i.p.v. EC (of "0 SBU" / geen credits)
- [x] Werkproces als term
- [x] Kerntaak als term
- [x] BPV i.p.v. Stage (indien van toepassing)

---

## Feature B: MBO Validaties

### TC-B01: Leerweg leeg (Negatieve test)

**Doel:** Verifieer dat leerweg verplicht is

**Precondities:**
- Gebruiker is op `/demo/nieuw/mbo` stap 3

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Vul basisgegevens in stap 2 | Ga naar stap 3 |
| 2 | Wijzig leerweg naar lege waarde (indien mogelijk) | - |
| 3 | Klik "Opleiding aanmaken" | Validatiefout OF default waarde toegepast |

**Acceptatiecriteria:**
- [x] Dropdown heeft altijd een default waarde (BOL)
- [x] Lege selectie is niet mogelijk

**Opmerking:** Huidige implementatie heeft default waarde, geen foutmelding nodig.

---

### TC-B02: Duur = 0 (Negatieve test)

**Doel:** Verifieer dat duur minimaal 1 jaar moet zijn

**Precondities:**
- Gebruiker is op `/demo/nieuw/mbo` stap 2

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Probeer duur op 0 te zetten | Input heeft min=1 attribuut |
| 2 | Forceer waarde 0 via dev tools | Backend validatie pakt dit af |

**Acceptatiecriteria:**
- [x] Frontend input blokkeert 0
- [x] Backend valideert duur > 0

---

### TC-B03: Opleidingsnaam leeg (Negatieve test)

**Doel:** Verifieer dat naam verplicht is

**Precondities:**
- Gebruiker is op `/demo/nieuw/mbo` stap 2

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Laat naam leeg | Veld heeft `required` attribuut |
| 2 | Probeer door te gaan | Browser blokkeert of server foutmelding |

**Acceptatiecriteria:**
- [x] Required attribuut op input
- [x] Zod schema valideert niet-lege string
- [x] Foutmelding is duidelijk in het Nederlands

---

### TC-B05: Geldige MBO invoer (Positieve test)

**Doel:** Verifieer complete happy path MBO

**Testdata:**
```
Academie: MBO College ICT
Naam: Netwerkbeheerder
Code: NB
Niveau: 3
Duur: 3 jaar
Leerweg: BBL
Ontwerpprincipe: BPV-primair
```

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Vul alle verplichte velden | Geen validatiefouten |
| 2 | Submit formulier | Success |
| 3 | Controleer database | MBOConfig aangemaakt |

**Acceptatiecriteria:**
- [x] Opleiding met educationType = "MBO"
- [x] MBOConfig met correcte leerweg, niveau, ontwerpprincipe
- [x] Redirect naar detail pagina

---

## Feature C: HBO Validaties

### TC-C01: Opleidingsnaam leeg (Negatieve test)

**Doel:** Verifieer dat naam verplicht is

**Precondities:**
- Gebruiker is op `/demo/nieuw/hbo` stap 2

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Laat naam leeg | Veld heeft `required` attribuut |
| 2 | Probeer door te gaan | Browser blokkeert of server foutmelding |

**Acceptatiecriteria:**
- [x] Required attribuut op input
- [x] Foutmelding zichtbaar

---

### TC-C07: Geldige HBO invoer (Positieve test)

**Doel:** Verifieer complete happy path HBO

**Testdata:**
```
Academie: School of Technology
Naam: Business IT & Management
Code: BIM
CROHO: 34406
Domein: Economie
Type: Bachelor
Duur: 4 jaar
EC: 240
Variant: Voltijd
Toetsfilosofie: Programmatisch
Ordeningsprincipe: Vraagstukken
Tijdsnede: Periode
```

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Vul alle velden | Geen validatiefouten |
| 2 | Submit formulier | Success |
| 3 | Controleer database | HBOConfig aangemaakt |

**Acceptatiecriteria:**
- [x] Opleiding met educationType = "HBO"
- [x] HBOConfig met alle geselecteerde opties
- [x] Redirect naar detail pagina

---

### TC-C08: EC niet deelbaar door 30 (Edge case)

**Doel:** Verifieer validatie voor EC (HBO standaard)

**Precondities:**
- Gebruiker is op `/demo/nieuw/hbo`

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Voer EC = 235 in | - |
| 2 | Submit formulier | Waarschuwing of acceptatie |

**Acceptatiecriteria:**
- [x] Systeem accepteert of geeft duidelijke feedback
- [x] Geen crash of onduidelijke fout

**Opmerking:** Huidige implementatie valideert EC >= 30, niet specifiek op veelvoud van 30.

---

## Feature D: Flow-integriteit

### TC-D01: Na config → Richtinggevende kaders

**Doel:** Verifieer navigatie naar visies na configuratie

**Precondities:**
- HBO of MBO opleiding met cohort aanwezig

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar `/demo/beheer/visies` | Visie overzicht getoond |
| 2 | Selecteer cohort | Visies zichtbaar |
| 3 | Open een visie | Detail pagina werkt |

**Acceptatiecriteria:**
- [x] Navigatie werkt zonder errors
- [x] Visies zijn koppelbaar aan cohort

---

### TC-D02: Na config → Grof curriculum

**Doel:** Verifieer navigatie naar curriculum overzicht

**Precondities:**
- Cohort met blokken aanwezig

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar `/demo/curriculum` | Curriculum overzicht getoond |
| 2 | Bekijk jaar/periode structuur | Blokken zichtbaar |

**Acceptatiecriteria:**
- [x] Blokken worden getoond per jaar
- [x] Credits/EC labeling correct

---

### TC-D03: Na config → Fijn curriculum

**Doel:** Verifieer navigatie naar blokdetail

**Precondities:**
- Blok met content aanwezig

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Klik op blok | Blokdetail pagina getoond |
| 2 | Bekijk onderwijseenheden | OE's zichtbaar |
| 3 | Bekijk weekplanning | Weekplanning aanwezig |

**Acceptatiecriteria:**
- [x] Blokdetail laadt correct
- [x] Toetsen/beoordelingen zichtbaar
- [x] Leeractiviteiten zichtbaar

---

## Feature E: Persistency & Navigatie

### TC-E01: Refresh behoud configuratie

**Doel:** Verifieer dat data persistent is

**Precondities:**
- Nieuwe opleiding zojuist aangemaakt

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Na aanmaken, druk F5 | Pagina herlaadt |
| 2 | Verifieer data | Opleiding en config nog aanwezig |

**Acceptatiecriteria:**
- [x] Data komt uit database, niet state
- [x] Geen data verlies na refresh

---

### TC-E02: Terug naar opleidingenlijst

**Doel:** Verifieer dat opleiding in lijst staat

**Precondities:**
- Meerdere opleidingen aanwezig (MBO + HBO)

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar `/demo/beheer/opleidingen` | Lijst getoond |
| 2 | Bekijk badges | MBO (blauw) en HBO (teal) badges |
| 3 | Bekijk credits | HBO: "240 EC", MBO: "0 SBU" of geen credits |

**Acceptatiecriteria:**
- [x] Beide onderwijstypes zichtbaar
- [x] Juiste badge kleuren
- [x] Credits formatting correct per type

---

### TC-E03: Bewerk opleiding

**Doel:** Verifieer dat config sectie werkt

**Precondities:**
- Opleiding met config aanwezig

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Open opleiding detail | `/demo/beheer/opleidingen/[id]` |
| 2 | Bekijk config sectie | "HBO Configuratie" of "MBO Configuratie" |
| 3 | Klik op sectie header | Sectie klapt uit |
| 4 | Bekijk formulier | Huidige waarden voorgevuld |

**Acceptatiecriteria:**
- [x] Config sectie is uitklapbaar
- [x] Badge toont "Geconfigureerd"
- [x] Waarden zijn correct

---

## Feature F: Basis Kwaliteitschecks

### TC-F01: Form error states zichtbaar

**Doel:** Verifieer visuele feedback bij fouten

**Precondities:**
- Gebruiker is op wizard pagina

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Submit leeg formulier | Browser/server validatie |
| 2 | Bekijk error styling | Rode border op velden |
| 3 | Bekijk error melding | Alert component met fout |

**Acceptatiecriteria:**
- [x] Foutmeldingen in het Nederlands
- [x] Visuele indicatie welk veld fout is
- [x] Alert variant="error" voor server fouten

---

### TC-F02: Console errors normale flow

**Doel:** Verifieer geen JavaScript errors

**Precondities:**
- Browser developer tools open (Console tab)

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Clear console | - |
| 2 | Doorloop complete wizard | MBO of HBO |
| 3 | Bekijk console | Geen errors (warnings OK) |

**Acceptatiecriteria:**
- [x] Geen rode errors in console
- [x] Geen uncaught exceptions
- [x] Geen React key warnings

---

### TC-F03: Laadtijd configuratiescherm

**Doel:** Verifieer acceptabele performance

**Precondities:**
- Browser Network tab open

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar `/demo/nieuw` | - |
| 2 | Meet tijd tot interactive | < 3 seconden |
| 3 | Open HBO of MBO wizard | < 3 seconden |

**Acceptatiecriteria:**
- [x] Initiële load < 3 sec
- [x] Wizard pagina's < 2 sec
- [x] Geen blocking renders

---

## Regressietesten

### RT-01: Bestaande opleidingen nog toegankelijk

**Doel:** Verifieer dat seed data nog werkt

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Open HBO-ICT opleiding | Detail pagina laadt |
| 2 | Bekijk cohort 2024-2025 | Cohort zichtbaar |
| 3 | Bekijk curriculum | Blokken aanwezig |

---

### RT-02: Visies nog bewerkbaar

**Doel:** Verifieer dat visie functionaliteit intact is

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar visies | Lijst getoond |
| 2 | Open "Visie op Leren" | Content zichtbaar |
| 3 | Bewerk indien mogelijk | Geen errors |

---

### RT-03: Leeruitkomsten nog koppelbaar

**Doel:** Verifieer dat leeruitkomsten werken

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar leeruitkomsten | Lijst getoond |
| 2 | Open leeruitkomst | Detail zichtbaar |
| 3 | Bekijk koppelingen | Toetsen/blokken getoond |

---

### RT-04: Curriculum blokken nog bewerkbaar

**Doel:** Verifieer dat curriculum functionaliteit intact is

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar curriculum | Overzicht getoond |
| 2 | Open blok "Introductie ICT" | Detail pagina laadt |
| 3 | Bekijk onderwijseenheden | OE's zichtbaar |
| 4 | Bekijk toetsen | Toetsen zichtbaar |

---

### RT-05: Cohorten nog aanmaakbaar

**Doel:** Verifieer dat cohort CRUD werkt

**Stappen:**
| Stap | Actie | Expected Result |
|------|-------|-----------------|
| 1 | Navigeer naar cohorten | Lijst getoond |
| 2 | Klik "Nieuw cohort" | Formulier getoond |
| 3 | Vul gegevens in | - |
| 4 | Submit | Cohort aangemaakt |

---

## Release Checklist

### Pre-release Verificatie

| Check | Status | Opmerkingen |
|-------|--------|-------------|
| Alle TC-A tests PASSED | ☐ | Startconfiguratie |
| Alle TC-B tests PASSED | ☐ | MBO validaties |
| Alle TC-C tests PASSED | ☐ | HBO validaties |
| Alle TC-D tests PASSED | ☐ | Flow-integriteit |
| Alle TC-E tests PASSED | ☐ | Persistency |
| Alle TC-F tests PASSED | ☐ | Kwaliteit |
| Alle RT tests PASSED | ☐ | Regressie |
| Build succesvol (`npm run build`) | ☐ | Geen TypeScript errors |
| Database migratie getest | ☐ | Prisma push/migrate |
| Seed data werkt | ☐ | `npm run db:seed` |
| Cross-browser test (Chrome, Firefox, Safari) | ☐ | Minimaal 1 flow per browser |

### Go/No-Go Criteria

**GO wanneer:**
- [x] Alle kritieke tests (TC-A01 t/m TC-A08) passed
- [x] Geen blokkers in negatieve tests
- [x] Alle regressietests passed
- [x] Build zonder errors
- [x] Geen console errors bij normale flow

**NO-GO wanneer:**
- [ ] Opleiding aanmaken faalt
- [ ] Data verlies na refresh
- [ ] Server error bij normale navigatie
- [ ] Type mismatch in terminologie

---

## Bijlagen

### A. URLs Overzicht

| Pagina | URL |
|--------|-----|
| Home | http://localhost:3000 |
| Demo | http://localhost:3000/demo |
| Nieuwe opleiding (keuze) | http://localhost:3000/demo/nieuw |
| HBO Wizard | http://localhost:3000/demo/nieuw/hbo |
| MBO Wizard | http://localhost:3000/demo/nieuw/mbo |
| Opleidingen lijst | http://localhost:3000/demo/beheer/opleidingen |
| Opleiding detail | http://localhost:3000/demo/beheer/opleidingen/[id] |
| Curriculum | http://localhost:3000/demo/curriculum |
| Visies | http://localhost:3000/demo/beheer/visies |

### B. Sneltoetsen

| Actie | Commando |
|-------|----------|
| Start dev server | `npm run dev` |
| Build | `npm run build` |
| Reset database | `npm run db:push && npm run db:seed` |
| Type check | `npm run type-check` (indien beschikbaar) |

### C. Bekende Beperkingen

1. **MBO kerntaken/werkprocessen:** Moeten handmatig worden toegevoegd na aanmaken opleiding
2. **Terminologie context:** Werkt alleen volledig bij componenten die EducationProvider gebruiken
3. **Switchen MBO↔HBO:** Niet ondersteund, nieuwe opleiding vereist

---

**Document opgesteld door:** Claude Code
**Review door:** [Naam Reviewer]
**Goedgekeurd op:** [Datum]
