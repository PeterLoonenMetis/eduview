import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

// Get the database path - from project root
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Start seeding...");

  // Clean up existing data
  await prisma.rubricLevel.deleteMany();
  await prisma.assessmentCriterion.deleteMany();
  await prisma.assessmentOutcome.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.assignmentProfessionalTask.deleteMany();
  await prisma.assignmentOutcome.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.learningActivity.deleteMany();
  await prisma.weekPlanning.deleteMany();
  await prisma.teachingUnit.deleteMany();
  await prisma.blockVisionRelation.deleteMany();
  await prisma.block.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.outcomeVisionLink.deleteMany();
  await prisma.learningOutcome.deleteMany();
  await prisma.professionalTask.deleteMany();
  await prisma.professionalRole.deleteMany();
  await prisma.visionPrinciple.deleteMany();
  await prisma.vision.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.userProgram.deleteMany();
  // Clean MBO/HBO configs
  await prisma.werkproces.deleteMany();
  await prisma.kerntaak.deleteMany();
  await prisma.keuzedeel.deleteMany();
  await prisma.mBOConfig.deleteMany();
  await prisma.hBOConfig.deleteMany();
  await prisma.program.deleteMany();
  await prisma.academy.deleteMany();
  await prisma.userInstitute.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.contentVersion.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institute.deleteMany();

  console.log("✅ Cleaned existing data");

  // Create demo users
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const demoPasswordHash = await bcrypt.hash("demo1234", 12);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@eduview.nl",
      passwordHash: adminPasswordHash,
      firstName: "Admin",
      lastName: "EduView",
      name: "Admin EduView",
      role: "ADMIN",
      isActive: true,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@eduview.nl",
      passwordHash: demoPasswordHash,
      firstName: "Demo",
      lastName: "Gebruiker",
      name: "Demo Gebruiker",
      role: "TEACHER",
      isActive: true,
    },
  });

  console.log("✅ Created demo users:");
  console.log("   📧 admin@eduview.nl / admin123 (Admin)");
  console.log("   📧 demo@eduview.nl / demo1234 (Teacher)");

  // Create Institute
  const institute = await prisma.institute.create({
    data: {
      name: "Hogeschool Voorbeeld",
      code: "HV",
      primaryColor: "#164B44",
      secondaryColor: "#E8AE27",
    },
  });
  console.log(`✅ Created institute: ${institute.name}`);

  // Create Academy
  const academy = await prisma.academy.create({
    data: {
      instituteId: institute.id,
      name: "School of Technology",
      code: "SOT",
      description: "De School of Technology biedt innovatieve ICT-opleidingen.",
    },
  });
  console.log(`✅ Created academy: ${academy.name}`);

  // Create HBO Program
  const program = await prisma.program.create({
    data: {
      academyId: academy.id,
      name: "HBO-ICT",
      code: "ICT",
      crohoCode: "34479",
      educationType: "HBO",
      degreeType: "BACHELOR",
      durationYears: 4,
      totalCredits: 240,
    },
  });
  console.log(`✅ Created HBO program: ${program.name}`);

  // Create HBO Config for the program
  await prisma.hBOConfig.create({
    data: {
      programId: program.id,
      domein: "Techniek",
      variant: "VOLTIJD",
      toetsfilosofie: "TRADITIONEEL",
      ordeningsprincipe: "THEMAS",
      tijdsnede: "SEMESTER",
    },
  });
  console.log("✅ Created HBO config for program");

  // Create MBO Academy and Program for demo
  const mboAcademy = await prisma.academy.create({
    data: {
      instituteId: institute.id,
      name: "MBO College ICT",
      code: "MCT",
      description: "MBO-opleidingen in de ICT-sector.",
    },
  });
  console.log(`✅ Created MBO academy: ${mboAcademy.name}`);

  // Create MBO Program
  const mboProgram = await prisma.program.create({
    data: {
      academyId: mboAcademy.id,
      name: "Applicatieontwikkelaar",
      code: "AO",
      educationType: "MBO",
      degreeType: "BACHELOR", // Required but not used for MBO
      durationYears: 4,
      totalCredits: 0, // MBO uses SBU, not EC
    },
  });
  console.log(`✅ Created MBO program: ${mboProgram.name}`);

  // Create MBO Config with kerntaken and werkprocessen
  const mboConfig = await prisma.mBOConfig.create({
    data: {
      programId: mboProgram.id,
      leerweg: "BOL",
      niveau: "NIVEAU_4",
      ontwerpprincipe: "HYBRIDE",
      kdNaam: "ICT- en Mediabeheer",
      kdVersie: "2024",
      kdPeildatum: new Date("2024-01-01"),
    },
  });

  // Create Kerntaken with Werkprocessen for MBO
  await prisma.kerntaak.create({
    data: {
      mboConfigId: mboConfig.id,
      code: "K1",
      naam: "Ontwerpen en ontwikkelen van applicaties",
      beschrijving: "Het ontwerpen, bouwen en testen van softwareapplicaties.",
      sortOrder: 1,
      werkprocessen: {
        create: [
          {
            code: "W1.1",
            naam: "Analyseert behoeften van opdrachtgevers",
            beschrijving: "Voert een requirements analyse uit en documenteert de bevindingen.",
            sortOrder: 1,
          },
          {
            code: "W1.2",
            naam: "Ontwerpt technische oplossingen",
            beschrijving: "Maakt een technisch ontwerp op basis van de requirements.",
            sortOrder: 2,
          },
          {
            code: "W1.3",
            naam: "Realiseert applicaties",
            beschrijving: "Programmeert en test softwareapplicaties.",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  await prisma.kerntaak.create({
    data: {
      mboConfigId: mboConfig.id,
      code: "K2",
      naam: "Beheren en onderhouden van applicaties",
      beschrijving: "Het beheren, onderhouden en verbeteren van bestaande applicaties.",
      sortOrder: 2,
      werkprocessen: {
        create: [
          {
            code: "W2.1",
            naam: "Beheert applicaties",
            beschrijving: "Monitort en onderhoudt applicaties in productie.",
            sortOrder: 1,
          },
          {
            code: "W2.2",
            naam: "Optimaliseert applicaties",
            beschrijving: "Verbetert performance en functionaliteit van applicaties.",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  console.log("✅ Created MBO config with kerntaken and werkprocessen");

  // Create Cohort
  const cohort = await prisma.cohort.create({
    data: {
      programId: program.id,
      name: "2024-2025",
      startYear: 2024,
      endYear: 2028,
      status: "ACTIVE",
      isActive: true,
    },
  });
  console.log(`✅ Created cohort: ${cohort.name}`);

  // Create Visions
  const visionLearning = await prisma.vision.create({
    data: {
      cohortId: cohort.id,
      type: "LEARNING",
      title: "Visie op Leren en Onderwijs",
      content: `## Onze Onderwijsvisie

Onze opleiding HBO-ICT hanteert een constructivistische benadering waarbij studenten actief hun eigen kennis en vaardigheden opbouwen.

### Uitgangspunten

1. **Constructivisme** - Studenten construeren actief hun eigen kennis door ervaring en reflectie.
2. **Authentiek leren** - Leeractiviteiten zijn gebaseerd op echte beroepssituaties en -vraagstukken.
3. **Samenwerkend leren** - Kennis wordt ontwikkeld door sociale interactie en samenwerking.
4. **Zelfsturing** - Studenten nemen toenemend regie over hun eigen leerproces.`,
      status: "APPROVED",
      principles: {
        create: [
          {
            title: "Constructivisme",
            description: "Studenten construeren actief hun eigen kennis door ervaring en reflectie.",
            sortOrder: 1,
          },
          {
            title: "Authentiek leren",
            description: "Leeractiviteiten zijn gebaseerd op echte beroepssituaties en -vraagstukken.",
            sortOrder: 2,
          },
          {
            title: "Samenwerkend leren",
            description: "Kennis wordt ontwikkeld door sociale interactie en samenwerking.",
            sortOrder: 3,
          },
          {
            title: "Zelfsturing",
            description: "Studenten nemen toenemend regie over hun eigen leerproces.",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  const visionProfession = await prisma.vision.create({
    data: {
      cohortId: cohort.id,
      type: "PROFESSION",
      title: "Visie op het Beroep",
      content: `## De ICT-Professional van Morgen

De arbeidsmarkt voor ICT-professionals is dynamisch en veeleisend. Onze afgestudeerden zijn voorbereid op diverse rollen binnen het ICT-werkveld.

### Beroepsrollen

- **Software Developer** - Ontwerpt en realiseert softwareoplossingen
- **Infrastructure Specialist** - Beheert en optimaliseert IT-infrastructuur
- **Business IT Consultant** - Adviseert over ICT-oplossingen voor bedrijfsvraagstukken`,
      status: "APPROVED",
      principles: {
        create: [
          {
            title: "T-shaped professional",
            description: "Brede basis met diepgang in een specialisatie.",
            sortOrder: 1,
          },
          {
            title: "Agile mindset",
            description: "Flexibel inspelen op veranderende omstandigheden.",
            sortOrder: 2,
          },
          {
            title: "Leven lang leren",
            description: "Continue professionele ontwikkeling als kerncompetentie.",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  const visionAssessment = await prisma.vision.create({
    data: {
      cohortId: cohort.id,
      type: "ASSESSMENT",
      title: "Visie op Toetsing en Examinering",
      content: `## Toetsbeleid

Toetsing is een integraal onderdeel van het leerproces.

### Uitgangspunten

1. **Formatief en Summatief** - Elk blok bevat zowel formatieve als summatieve toetsmomenten.
2. **Authentieke Toetsvormen** - Portfolio's, presentaties en productbeoordelingen naast kennistoetsen.
3. **Transparantie** - Studenten weten vooraf wat er verwacht wordt.`,
      status: "APPROVED",
      principles: {
        create: [
          {
            title: "Formatief en Summatief",
            description: "Elk blok bevat zowel formatieve als summatieve toetsmomenten.",
            sortOrder: 1,
          },
          {
            title: "Authentieke Toetsvormen",
            description: "Portfolio's, presentaties en productbeoordelingen naast kennistoetsen.",
            sortOrder: 2,
          },
          {
            title: "Transparantie",
            description: "Studenten weten vooraf wat er verwacht wordt.",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log("✅ Created 3 visions with principles");

  // Create Learning Outcomes
  const learningOutcomes = await Promise.all([
    prisma.learningOutcome.create({
      data: {
        cohortId: cohort.id,
        code: "LU-01",
        title: "Analyseren van requirements",
        description: "De student kan gebruikerswensen en -behoeften analyseren en vertalen naar functionele en technische requirements.",
        level: "ANALYZE",
        category: "SKILLS",
        sortOrder: 1,
      },
    }),
    prisma.learningOutcome.create({
      data: {
        cohortId: cohort.id,
        code: "LU-02",
        title: "Software ontwerpen",
        description: "De student kan een softwarearchitectuur ontwerpen die voldoet aan de gestelde requirements en kwaliteitseisen.",
        level: "CREATE",
        category: "SKILLS",
        sortOrder: 2,
      },
    }),
    prisma.learningOutcome.create({
      data: {
        cohortId: cohort.id,
        code: "LU-03",
        title: "Code schrijven",
        description: "De student kan clean, onderhoudbare en testbare code schrijven in gangbare programmeertalen.",
        level: "APPLY",
        category: "SKILLS",
        sortOrder: 3,
      },
    }),
    prisma.learningOutcome.create({
      data: {
        cohortId: cohort.id,
        code: "LU-04",
        title: "Samenwerken in teams",
        description: "De student kan effectief samenwerken in multidisciplinaire teams.",
        level: "APPLY",
        category: "ATTITUDE",
        sortOrder: 4,
      },
    }),
    prisma.learningOutcome.create({
      data: {
        cohortId: cohort.id,
        code: "LU-05",
        title: "Reflecteren op eigen ontwikkeling",
        description: "De student kan kritisch reflecteren op eigen handelen en ontwikkelpunten formuleren.",
        level: "EVALUATE",
        category: "ATTITUDE",
        sortOrder: 5,
      },
    }),
    prisma.learningOutcome.create({
      data: {
        cohortId: cohort.id,
        code: "LU-06",
        title: "Projectmatig werken",
        description: "De student kan projecten plannen, organiseren en beheersen volgens gangbare methodieken.",
        level: "APPLY",
        category: "SKILLS",
        sortOrder: 6,
      },
    }),
  ]);
  console.log(`✅ Created ${learningOutcomes.length} learning outcomes`);

  // Create Academic Years
  const academicYears = await Promise.all([
    prisma.academicYear.create({
      data: {
        cohortId: cohort.id,
        yearNumber: 1,
        name: "Propedeuse",
        targetCredits: 60,
        description: "Het eerste jaar van de opleiding, gericht op brede oriëntatie en basisvaardigheden.",
        sortOrder: 1,
      },
    }),
    prisma.academicYear.create({
      data: {
        cohortId: cohort.id,
        yearNumber: 2,
        name: "Hoofdfase 1",
        targetCredits: 60,
        description: "Verdieping in kernonderwerpen en start van profilering.",
        sortOrder: 2,
      },
    }),
    prisma.academicYear.create({
      data: {
        cohortId: cohort.id,
        yearNumber: 3,
        name: "Hoofdfase 2",
        targetCredits: 60,
        description: "Stage en verdere specialisatie.",
        sortOrder: 3,
      },
    }),
    prisma.academicYear.create({
      data: {
        cohortId: cohort.id,
        yearNumber: 4,
        name: "Hoofdfase 3",
        targetCredits: 60,
        description: "Minor en afstuderen.",
        sortOrder: 4,
      },
    }),
  ]);
  console.log(`✅ Created ${academicYears.length} academic years`);

  // Define blocks data
  const blocksData = [
    // Year 1
    { yearIndex: 0, code: "PRO-Y1-B1", name: "Introductie ICT", shortDesc: "Kennismaking met het brede ICT-vakgebied en ontwikkeling van basisvaardigheden.", type: "EDUCATIONAL", credits: 15, status: "APPROVED", sortOrder: 1, vr: { learning: "STRONG", profession: "MODERATE", assessment: "MODERATE" } },
    { yearIndex: 0, code: "PRO-Y1-B2", name: "Projectmanagement", shortDesc: "Leren projectmatig werken in een ICT-context met echte opdrachtgevers.", type: "PROJECT", credits: 15, status: "APPROVED", sortOrder: 2, vr: { learning: "STRONG", profession: "STRONG", assessment: "MODERATE" } },
    { yearIndex: 0, code: "PRO-Y1-B3", name: "Praktijkvraagstuk 1", shortDesc: "Eerste authentieke beroepsopdracht vanuit het werkveld.", type: "PRACTICAL", credits: 15, status: "APPROVED", sortOrder: 3, vr: { learning: "MODERATE", profession: "STRONG", assessment: "STRONG" } },
    { yearIndex: 0, code: "PRO-Y1-B4", name: "Research Methods", shortDesc: "Introductie in onderzoeksmethoden voor ICT-professionals.", type: "EDUCATIONAL", credits: 15, status: "IN_REVIEW", sortOrder: 4, vr: { learning: "STRONG", profession: "MODERATE", assessment: "MODERATE" } },
    // Year 2
    { yearIndex: 1, code: "HF1-Y2-B1", name: "Database Design", shortDesc: "Ontwerp en implementatie van relationele en NoSQL databases.", type: "EDUCATIONAL", credits: 15, status: "APPROVED", sortOrder: 1, vr: { learning: "STRONG", profession: "STRONG", assessment: "MODERATE" } },
    { yearIndex: 1, code: "HF1-Y2-B2", name: "Integraal Project 2", shortDesc: "Groot teamproject met externe opdrachtgever en agile methodiek.", type: "PROJECT", credits: 15, status: "APPROVED", sortOrder: 2, vr: { learning: "STRONG", profession: "STRONG", assessment: "STRONG" } },
    { yearIndex: 1, code: "HF1-Y2-B3", name: "Web Development", shortDesc: "Frontend en backend development met moderne frameworks.", type: "EDUCATIONAL", credits: 15, status: "DRAFT", sortOrder: 3, vr: { learning: "MODERATE", profession: "STRONG", assessment: "MODERATE" } },
    { yearIndex: 1, code: "HF1-Y2-B4", name: "Cloud Infrastructure", shortDesc: "Cloud computing en DevOps principes in de praktijk.", type: "PRACTICAL", credits: 15, status: "DRAFT", sortOrder: 4, vr: { learning: "MODERATE", profession: "STRONG", assessment: "STRONG" } },
    // Year 3
    { yearIndex: 2, code: "HF2-Y3-B1", name: "Specialisatie", shortDesc: "Verdieping in gekozen specialisatierichting.", type: "EDUCATIONAL", credits: 15, status: "DRAFT", sortOrder: 1, vr: { learning: "STRONG", profession: "STRONG", assessment: "MODERATE" } },
    { yearIndex: 2, code: "HF2-Y3-B2", name: "Stage", shortDesc: "20 weken beroepspraktijkvorming bij een ICT-bedrijf.", type: "INTERNSHIP", credits: 30, status: "APPROVED", sortOrder: 2, vr: { learning: "MODERATE", profession: "STRONG", assessment: "STRONG" }, durationWeeks: 20 },
    { yearIndex: 2, code: "HF2-Y3-B3", name: "Research Project", shortDesc: "Toegepast onderzoek in de beroepspraktijk.", type: "PRACTICAL", credits: 15, status: "DRAFT", sortOrder: 3, vr: { learning: "STRONG", profession: "MODERATE", assessment: "STRONG" } },
    // Year 4
    { yearIndex: 3, code: "HF3-Y4-B1", name: "Minor", shortDesc: "Keuzeprogramma voor verbreding of verdieping.", type: "EDUCATIONAL", credits: 30, status: "DRAFT", sortOrder: 1, vr: { learning: "MODERATE", profession: "MODERATE", assessment: "MODERATE" }, durationWeeks: 20 },
    { yearIndex: 3, code: "HF3-Y4-B2", name: "Afstuderen", shortDesc: "Individuele afstudeeropdracht bij een bedrijf.", type: "GRADUATION", credits: 30, status: "APPROVED", sortOrder: 2, vr: { learning: "MODERATE", profession: "STRONG", assessment: "STRONG" }, durationWeeks: 20 },
  ];

  // Create Blocks with Vision Relations
  const blocks = [];
  for (const blockData of blocksData) {
    const block = await prisma.block.create({
      data: {
        academicYearId: academicYears[blockData.yearIndex].id,
        code: blockData.code,
        name: blockData.name,
        shortDescription: blockData.shortDesc,
        type: blockData.type as any,
        credits: blockData.credits,
        durationWeeks: blockData.durationWeeks || 10,
        status: blockData.status as any,
        sortOrder: blockData.sortOrder,
        visionRelations: {
          create: [
            { visionType: "LEARNING", strength: blockData.vr.learning as any },
            { visionType: "PROFESSION", strength: blockData.vr.profession as any },
            { visionType: "ASSESSMENT", strength: blockData.vr.assessment as any },
          ],
        },
      },
    });
    blocks.push(block);
  }
  console.log(`✅ Created ${blocks.length} blocks with vision relations`);

  // Add detailed content to first block (Introductie ICT)
  const introBlock = blocks[0];

  // Create Teaching Units for the first block
  const teachingUnits = await Promise.all([
    prisma.teachingUnit.create({
      data: {
        blockId: introBlock.id,
        code: "OE-01",
        name: "Programmeren Basis",
        description: "Introductie in programmeren met Python.",
        credits: 5,
        contactHours: 40,
        selfStudyHours: 100,
        sortOrder: 1,
      },
    }),
    prisma.teachingUnit.create({
      data: {
        blockId: introBlock.id,
        code: "OE-02",
        name: "Databases Basis",
        description: "Relationele databases en SQL.",
        credits: 5,
        contactHours: 40,
        selfStudyHours: 100,
        sortOrder: 2,
      },
    }),
    prisma.teachingUnit.create({
      data: {
        blockId: introBlock.id,
        code: "OE-03",
        name: "Netwerken Basis",
        description: "Basisprincipes van computernetwerken.",
        credits: 5,
        contactHours: 40,
        selfStudyHours: 100,
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`✅ Created ${teachingUnits.length} teaching units`);

  // Create Week Plannings for the first teaching unit
  const weekThemes = [
    { week: 1, theme: "Introductie & Programmeren", activities: ["Hoorcollege: Wat is ICT?", "Werkcollege: Hello World in Python"] },
    { week: 2, theme: "Variabelen en Datatypen", activities: ["Hoorcollege: Variabelen en types", "Practicum: Oefeningen"] },
    { week: 3, theme: "Control Flow", activities: ["Hoorcollege: If-else en loops", "Workshop: Calculator app"] },
    { week: 4, theme: "Functies", activities: ["Hoorcollege: Functies en scope", "Werkcollege: Refactoring"] },
    { week: 5, theme: "Databases Intro", activities: ["Hoorcollege: Relationele databases", "Practicum: SQL basics"] },
    { week: 6, theme: "Database Design", activities: ["Workshop: ERD modelleren", "Practicum: Database maken"] },
    { week: 7, theme: "Netwerken Intro", activities: ["Hoorcollege: OSI model", "Practicum: Packet tracer"] },
    { week: 8, theme: "Web & Internet", activities: ["Hoorcollege: HTTP en DNS", "Workshop: Webserver opzetten"] },
    { week: 9, theme: "Integratie", activities: ["Projectwerk: Mini-applicatie", "Begeleiding"] },
    { week: 10, theme: "Afsluiting", activities: ["Presentaties", "Kennistoets"] },
  ];

  for (const weekData of weekThemes) {
    const weekPlanning = await prisma.weekPlanning.create({
      data: {
        teachingUnitId: teachingUnits[0].id,
        weekNumber: weekData.week,
        theme: weekData.theme,
        learningGoals: `Leerdoelen voor week ${weekData.week}: ${weekData.theme}`,
      },
    });

    // Create learning activities for each week
    for (let i = 0; i < weekData.activities.length; i++) {
      await prisma.learningActivity.create({
        data: {
          weekPlanningId: weekPlanning.id,
          name: weekData.activities[i],
          activityType: weekData.activities[i].includes("Hoorcollege") ? "LECTURE"
            : weekData.activities[i].includes("Werkcollege") ? "SEMINAR"
            : weekData.activities[i].includes("Workshop") ? "WORKSHOP"
            : weekData.activities[i].includes("Practicum") ? "PRACTICAL"
            : "GROUP_WORK",
          durationMinutes: 90,
          sortOrder: i + 1,
        },
      });
    }
  }
  console.log("✅ Created week plannings with activities");

  // Create Assessments for the first block
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        blockId: introBlock.id,
        code: "T-INT1-01",
        title: "Kennistoets ICT Basis",
        description: "Schriftelijke toets over de basisconcepten van ICT.",
        assessmentType: "SUMMATIVE",
        assessmentForm: "WRITTEN_EXAM_MIXED",
        isSummative: true,
        weight: 40,
        credits: 6,
        minimumGrade: 5.5,
        durationMinutes: 90,
        sortOrder: 1,
      },
    }),
    prisma.assessment.create({
      data: {
        blockId: introBlock.id,
        code: "T-INT1-02",
        title: "Portfolio Introductie ICT",
        description: "Portfolio met bewijsstukken van alle opdrachten.",
        assessmentType: "SUMMATIVE",
        assessmentForm: "PORTFOLIO",
        isSummative: true,
        weight: 60,
        credits: 9,
        minimumGrade: 5.5,
        sortOrder: 2,
      },
    }),
  ]);
  console.log(`✅ Created ${assessments.length} assessments`);

  // Link assessments to learning outcomes
  await prisma.assessmentOutcome.create({
    data: {
      assessmentId: assessments[0].id,
      outcomeId: learningOutcomes[2].id, // Code schrijven
      weight: 50,
    },
  });
  await prisma.assessmentOutcome.create({
    data: {
      assessmentId: assessments[0].id,
      outcomeId: learningOutcomes[0].id, // Analyseren
      weight: 50,
    },
  });
  await prisma.assessmentOutcome.create({
    data: {
      assessmentId: assessments[1].id,
      outcomeId: learningOutcomes[4].id, // Reflecteren
      weight: 100,
    },
  });
  console.log("✅ Linked assessments to learning outcomes");

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
