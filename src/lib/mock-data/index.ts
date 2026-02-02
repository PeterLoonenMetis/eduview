// Mock data for demo purposes

export const mockInstitute = {
  id: "inst-001",
  name: "Hogeschool Voorbeeld",
  code: "HV",
  primaryColor: "#164B44",
  secondaryColor: "#E8AE27",
};

export const mockProgram = {
  id: "prog-001",
  name: "HBO-ICT",
  code: "ICT",
  crohoCode: "34479",
  degreeType: "BACHELOR" as const,
  durationYears: 4,
  totalCredits: 240,
};

export const mockCohort = {
  id: "coh-2024",
  name: "2024-2025",
  startYear: 2024,
  endYear: 2028,
  status: "ACTIVE" as const,
};

export const mockVisions = [
  {
    id: "vis-001",
    type: "LEARNING" as const,
    title: "Visie op Leren en Onderwijs",
    status: "APPROVED" as const,
    principleCount: 4,
    content: `## Onze Onderwijsvisie

Onze opleiding HBO-ICT hanteert een constructivistische benadering waarbij studenten actief hun eigen kennis en vaardigheden opbouwen.

### Uitgangspunten

1. **Constructivisme** - Studenten construeren actief hun eigen kennis door ervaring en reflectie.
2. **Authentiek leren** - Leeractiviteiten zijn gebaseerd op echte beroepssituaties en -vraagstukken.
3. **Samenwerkend leren** - Kennis wordt ontwikkeld door sociale interactie en samenwerking.
4. **Zelfsturing** - Studenten nemen toenemend regie over hun eigen leerproces.`,
  },
  {
    id: "vis-002",
    type: "PROFESSION" as const,
    title: "Visie op het Beroep",
    status: "APPROVED" as const,
    principleCount: 3,
    content: `## De ICT-Professional van Morgen

De arbeidsmarkt voor ICT-professionals is dynamisch en veeleisend. Onze afgestudeerden zijn voorbereid op diverse rollen binnen het ICT-werkveld.

### Beroepsrollen

- **Software Developer** - Ontwerpt en realiseert softwareoplossingen
- **Infrastructure Specialist** - Beheert en optimaliseert IT-infrastructuur
- **Business IT Consultant** - Adviseert over ICT-oplossingen voor bedrijfsvraagstukken`,
  },
  {
    id: "vis-003",
    type: "ASSESSMENT" as const,
    title: "Visie op Toetsing en Examinering",
    status: "APPROVED" as const,
    principleCount: 3,
    content: `## Toetsbeleid

Toetsing is een integraal onderdeel van het leerproces.

### Uitgangspunten

1. **Formatief en Summatief** - Elk blok bevat zowel formatieve als summatieve toetsmomenten.
2. **Authentieke Toetsvormen** - Portfolio's, presentaties en productbeoordelingen naast kennistoetsen.
3. **Transparantie** - Studenten weten vooraf wat er verwacht wordt.`,
  },
];

export const mockLearningOutcomes = [
  {
    id: "lo-001",
    code: "LU-01",
    title: "Analyseren van requirements",
    description:
      "De student kan gebruikerswensen en -behoeften analyseren en vertalen naar functionele en technische requirements.",
    level: "ANALYZE" as const,
    category: "SKILLS" as const,
  },
  {
    id: "lo-002",
    code: "LU-02",
    title: "Software ontwerpen",
    description:
      "De student kan een softwarearchitectuur ontwerpen die voldoet aan de gestelde requirements en kwaliteitseisen.",
    level: "CREATE" as const,
    category: "SKILLS" as const,
  },
  {
    id: "lo-003",
    code: "LU-03",
    title: "Code schrijven",
    description:
      "De student kan clean, onderhoudbare en testbare code schrijven in gangbare programmeertalen.",
    level: "APPLY" as const,
    category: "SKILLS" as const,
  },
  {
    id: "lo-004",
    code: "LU-04",
    title: "Samenwerken in teams",
    description:
      "De student kan effectief samenwerken in multidisciplinaire teams.",
    level: "APPLY" as const,
    category: "ATTITUDE" as const,
  },
  {
    id: "lo-005",
    code: "LU-05",
    title: "Reflecteren op eigen ontwikkeling",
    description:
      "De student kan kritisch reflecteren op eigen handelen en ontwikkelpunten formuleren.",
    level: "EVALUATE" as const,
    category: "ATTITUDE" as const,
  },
  {
    id: "lo-006",
    code: "LU-06",
    title: "Projectmatig werken",
    description:
      "De student kan projecten plannen, organiseren en beheersen volgens gangbare methodieken.",
    level: "APPLY" as const,
    category: "SKILLS" as const,
  },
];

export const mockAcademicYears = [
  {
    id: "year-001",
    yearNumber: 1,
    name: "Propedeuse",
    targetCredits: 60,
    actualCredits: 60,
  },
  {
    id: "year-002",
    yearNumber: 2,
    name: "Hoofdfase 1",
    targetCredits: 60,
    actualCredits: 60,
  },
  {
    id: "year-003",
    yearNumber: 3,
    name: "Hoofdfase 2",
    targetCredits: 60,
    actualCredits: 60,
  },
  {
    id: "year-004",
    yearNumber: 4,
    name: "Hoofdfase 3",
    targetCredits: 60,
    actualCredits: 60,
  },
];

export const mockBlocks = [
  // Year 1
  {
    id: "block-001",
    code: "PRO-Y1-B1",
    name: "Introductie ICT",
    shortDescription:
      "Kennismaking met het brede ICT-vakgebied en ontwikkeling van basisvaardigheden.",
    type: "EDUCATIONAL" as const,
    credits: 15,
    status: "APPROVED" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 1,
    sortOrder: 1,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "MODERATE" as const,
      assessment: "MODERATE" as const,
    },
  },
  {
    id: "block-002",
    code: "PRO-Y1-B2",
    name: "Projectmanagement",
    shortDescription:
      "Leren projectmatig werken in een ICT-context met echte opdrachtgevers.",
    type: "PROJECT" as const,
    credits: 15,
    status: "APPROVED" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 1,
    sortOrder: 2,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "STRONG" as const,
      assessment: "MODERATE" as const,
    },
  },
  {
    id: "block-003",
    code: "PRO-Y1-B3",
    name: "Praktijkvraagstuk 1",
    shortDescription:
      "Eerste authentieke beroepsopdracht vanuit het werkveld.",
    type: "PRACTICAL" as const,
    credits: 15,
    status: "APPROVED" as const,
    assessmentCount: 1,
    durationWeeks: 10,
    yearNumber: 1,
    sortOrder: 3,
    visionRelations: {
      learning: "MODERATE" as const,
      profession: "STRONG" as const,
      assessment: "STRONG" as const,
    },
  },
  {
    id: "block-004",
    code: "PRO-Y1-B4",
    name: "Research Methods",
    shortDescription:
      "Introductie in onderzoeksmethoden voor ICT-professionals.",
    type: "EDUCATIONAL" as const,
    credits: 15,
    status: "IN_REVIEW" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 1,
    sortOrder: 4,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "MODERATE" as const,
      assessment: "MODERATE" as const,
    },
  },
  // Year 2
  {
    id: "block-005",
    code: "HF1-Y2-B1",
    name: "Database Design",
    shortDescription:
      "Ontwerp en implementatie van relationele en NoSQL databases.",
    type: "EDUCATIONAL" as const,
    credits: 15,
    status: "APPROVED" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 2,
    sortOrder: 1,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "STRONG" as const,
      assessment: "MODERATE" as const,
    },
  },
  {
    id: "block-006",
    code: "HF1-Y2-B2",
    name: "Integraal Project 2",
    shortDescription:
      "Groot teamproject met externe opdrachtgever en agile methodiek.",
    type: "PROJECT" as const,
    credits: 15,
    status: "APPROVED" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 2,
    sortOrder: 2,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "STRONG" as const,
      assessment: "STRONG" as const,
    },
  },
  {
    id: "block-007",
    code: "HF1-Y2-B3",
    name: "Web Development",
    shortDescription:
      "Frontend en backend development met moderne frameworks.",
    type: "EDUCATIONAL" as const,
    credits: 15,
    status: "DRAFT" as const,
    assessmentCount: 3,
    durationWeeks: 10,
    yearNumber: 2,
    sortOrder: 3,
    visionRelations: {
      learning: "MODERATE" as const,
      profession: "STRONG" as const,
      assessment: "MODERATE" as const,
    },
  },
  {
    id: "block-008",
    code: "HF1-Y2-B4",
    name: "Cloud Infrastructure",
    shortDescription:
      "Cloud computing en DevOps principes in de praktijk.",
    type: "PRACTICAL" as const,
    credits: 15,
    status: "DRAFT" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 2,
    sortOrder: 4,
    visionRelations: {
      learning: "MODERATE" as const,
      profession: "STRONG" as const,
      assessment: "STRONG" as const,
    },
  },
  // Year 3
  {
    id: "block-009",
    code: "HF2-Y3-B1",
    name: "Specialisatie",
    shortDescription:
      "Verdieping in gekozen specialisatierichting.",
    type: "EDUCATIONAL" as const,
    credits: 15,
    status: "DRAFT" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 3,
    sortOrder: 1,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "STRONG" as const,
      assessment: "MODERATE" as const,
    },
  },
  {
    id: "block-010",
    code: "HF2-Y3-B2",
    name: "Stage",
    shortDescription:
      "20 weken beroepspraktijkvorming bij een ICT-bedrijf.",
    type: "INTERNSHIP" as const,
    credits: 30,
    status: "APPROVED" as const,
    assessmentCount: 1,
    durationWeeks: 20,
    yearNumber: 3,
    sortOrder: 2,
    visionRelations: {
      learning: "MODERATE" as const,
      profession: "STRONG" as const,
      assessment: "STRONG" as const,
    },
  },
  {
    id: "block-011",
    code: "HF2-Y3-B3",
    name: "Research Project",
    shortDescription:
      "Toegepast onderzoek in de beroepspraktijk.",
    type: "PRACTICAL" as const,
    credits: 15,
    status: "DRAFT" as const,
    assessmentCount: 2,
    durationWeeks: 10,
    yearNumber: 3,
    sortOrder: 3,
    visionRelations: {
      learning: "STRONG" as const,
      profession: "MODERATE" as const,
      assessment: "STRONG" as const,
    },
  },
  // Year 4
  {
    id: "block-012",
    code: "HF3-Y4-B1",
    name: "Minor",
    shortDescription:
      "Keuzeprogramma voor verbreding of verdieping.",
    type: "EDUCATIONAL" as const,
    credits: 30,
    status: "DRAFT" as const,
    assessmentCount: 4,
    durationWeeks: 20,
    yearNumber: 4,
    sortOrder: 1,
    visionRelations: {
      learning: "MODERATE" as const,
      profession: "MODERATE" as const,
      assessment: "MODERATE" as const,
    },
  },
  {
    id: "block-013",
    code: "HF3-Y4-B2",
    name: "Afstuderen",
    shortDescription:
      "Individuele afstudeeropdracht bij een bedrijf.",
    type: "GRADUATION" as const,
    credits: 30,
    status: "APPROVED" as const,
    assessmentCount: 1,
    durationWeeks: 20,
    yearNumber: 4,
    sortOrder: 2,
    visionRelations: {
      learning: "MODERATE" as const,
      profession: "STRONG" as const,
      assessment: "STRONG" as const,
    },
  },
];

export const mockBlockDetail = {
  id: "block-001",
  code: "PRO-Y1-B1",
  name: "Introductie ICT",
  shortDescription:
    "Kennismaking met het brede ICT-vakgebied en ontwikkeling van basisvaardigheden.",
  longDescription: `In dit blok maken studenten kennis met de verschillende domeinen binnen ICT: softwareontwikkeling, infrastructuur, business IT en security. Ze ontwikkelen basisvaardigheden in programmeren, databases en netwerken. Het blok wordt afgesloten met een kleine praktijkopdracht waarin alle aspecten samenkomen.

## Leerdoelen

Na afloop van dit blok kan de student:
- De belangrijkste ICT-domeinen benoemen en beschrijven
- Eenvoudige programma's schrijven in Python
- Een relationele database ontwerpen en bevragen met SQL
- De basis van computernetwerken uitleggen
- Samenwerken in een klein projectteam`,
  type: "EDUCATIONAL" as const,
  credits: 15,
  status: "APPROVED" as const,
  durationWeeks: 10,
  visionRelations: {
    learning: "STRONG" as const,
    profession: "MODERATE" as const,
    assessment: "MODERATE" as const,
  },
  teachingUnits: [
    {
      id: "unit-001",
      code: "OE-01",
      name: "Programmeren Basis",
      credits: 5,
      contactHours: 40,
      selfStudyHours: 100,
    },
    {
      id: "unit-002",
      code: "OE-02",
      name: "Databases Basis",
      credits: 5,
      contactHours: 40,
      selfStudyHours: 100,
    },
    {
      id: "unit-003",
      code: "OE-03",
      name: "Netwerken Basis",
      credits: 5,
      contactHours: 40,
      selfStudyHours: 100,
    },
  ],
  assessments: [
    {
      id: "assess-001",
      code: "T-INT1-01",
      title: "Kennistoets ICT Basis",
      assessmentForm: "WRITTEN_EXAM_MIXED" as const,
      isSummative: true,
      weight: 40,
      credits: 6,
      minimumGrade: 5.5,
    },
    {
      id: "assess-002",
      code: "T-INT1-02",
      title: "Portfolio Introductie ICT",
      assessmentForm: "PORTFOLIO" as const,
      isSummative: true,
      weight: 60,
      credits: 9,
      minimumGrade: 5.5,
    },
  ],
  weekPlannings: [
    {
      weekNumber: 1,
      theme: "Introductie & Programmeren",
      activities: ["Hoorcollege: Wat is ICT?", "Werkcollege: Hello World in Python"],
    },
    {
      weekNumber: 2,
      theme: "Variabelen en Datatypen",
      activities: ["Hoorcollege: Variabelen en types", "Practicum: Oefeningen"],
    },
    {
      weekNumber: 3,
      theme: "Control Flow",
      activities: ["Hoorcollege: If-else en loops", "Workshop: Calculator app"],
    },
    {
      weekNumber: 4,
      theme: "Functies",
      activities: ["Hoorcollege: Functies en scope", "Werkcollege: Refactoring"],
    },
    {
      weekNumber: 5,
      theme: "Databases Intro",
      activities: ["Hoorcollege: Relationele databases", "Practicum: SQL basics"],
    },
    {
      weekNumber: 6,
      theme: "Database Design",
      activities: ["Workshop: ERD modelleren", "Practicum: Database maken"],
    },
    {
      weekNumber: 7,
      theme: "Netwerken Intro",
      activities: ["Hoorcollege: OSI model", "Practicum: Packet tracer"],
    },
    {
      weekNumber: 8,
      theme: "Web & Internet",
      activities: ["Hoorcollege: HTTP en DNS", "Workshop: Webserver opzetten"],
    },
    {
      weekNumber: 9,
      theme: "Integratie",
      activities: ["Projectwerk: Mini-applicatie", "Begeleiding"],
    },
    {
      weekNumber: 10,
      theme: "Afsluiting",
      activities: ["Presentaties", "Kennistoets"],
    },
  ],
};

// Helper to get blocks by year
export function getBlocksByYear(yearNumber: number) {
  return mockBlocks.filter((block) => block.yearNumber === yearNumber);
}

// Calculate totals
export function calculateYearCredits(yearNumber: number): number {
  return getBlocksByYear(yearNumber).reduce(
    (sum, block) => sum + block.credits,
    0
  );
}

export function calculateTotalCredits(): number {
  return mockBlocks.reduce((sum, block) => sum + block.credits, 0);
}
