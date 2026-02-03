import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding PostgreSQL database...");

  // Clean up existing data (in reverse order of dependencies)
  console.log("Cleaning existing data...");

  try {
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
  } catch (e) {
    console.log("Note: Some tables may not exist yet, continuing...");
  }

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
      name: "Hogeschool Rotterdam",
      code: "HR",
      primaryColor: "#164B44",
      secondaryColor: "#E8AE27",
    },
  });
  console.log(`✅ Created institute: ${institute.name}`);

  // Create second institute for demo
  const institute2 = await prisma.institute.create({
    data: {
      name: "ROC Zadkine",
      code: "RZ",
      primaryColor: "#003366",
      secondaryColor: "#FF9900",
    },
  });
  console.log(`✅ Created institute: ${institute2.name}`);

  // Create Academy for HR
  const academy = await prisma.academy.create({
    data: {
      instituteId: institute.id,
      name: "Instituut voor Communicatie, Media en IT",
      code: "CMI",
      description: "Het CMI biedt innovatieve ICT-opleidingen.",
    },
  });
  console.log(`✅ Created academy: ${academy.name}`);

  // Create MBO Academy for Zadkine
  const mboAcademy = await prisma.academy.create({
    data: {
      instituteId: institute2.id,
      name: "College ICT",
      code: "CICT",
      description: "MBO-opleidingen in de ICT-sector.",
    },
  });
  console.log(`✅ Created MBO academy: ${mboAcademy.name}`);

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

  // Create MBO Program
  const mboProgram = await prisma.program.create({
    data: {
      academyId: mboAcademy.id,
      name: "Applicatieontwikkelaar",
      code: "AO",
      educationType: "MBO",
      degreeType: "MBO4",
      durationYears: 4,
      totalCredits: 0,
    },
  });
  console.log(`✅ Created MBO program: ${mboProgram.name}`);

  // Create Cohort for HBO
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

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\nYou can now:");
  console.log("1. Login with admin@eduview.nl / admin123");
  console.log("2. Create new schools and programs via the UI");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
