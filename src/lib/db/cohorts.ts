import prisma from "@/lib/prisma";
import type { CohortStatus } from "@prisma/client";

export type CohortWithRelations = Awaited<ReturnType<typeof getCohortById>>;

export async function getCohorts(programId?: string) {
  return prisma.cohort.findMany({
    where: programId ? { programId } : undefined,
    include: {
      program: {
        include: {
          academy: {
            include: {
              institute: true,
            },
          },
        },
      },
      _count: {
        select: {
          visions: true,
          learningOutcomes: true,
          academicYears: true,
        },
      },
    },
    orderBy: { startYear: "desc" },
  });
}

export async function getCohortById(id: string) {
  return prisma.cohort.findUnique({
    where: { id },
    include: {
      program: {
        include: {
          academy: {
            include: {
              institute: true,
            },
          },
        },
      },
      visions: {
        include: {
          principles: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      learningOutcomes: {
        orderBy: { sortOrder: "asc" },
      },
      academicYears: {
        orderBy: { yearNumber: "asc" },
        include: {
          blocks: {
            orderBy: { sortOrder: "asc" },
            include: {
              visionRelations: true,
              _count: {
                select: {
                  assessments: true,
                  teachingUnits: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getActiveCohort(programId: string) {
  return prisma.cohort.findFirst({
    where: {
      programId,
      isActive: true,
    },
    include: {
      program: true,
      visions: true,
      academicYears: {
        orderBy: { yearNumber: "asc" },
      },
    },
  });
}

export type CreateCohortInput = {
  programId: string;
  name: string;
  startYear: number;
  endYear: number;
  status?: CohortStatus;
  isActive?: boolean;
};

export async function createCohort(data: CreateCohortInput) {
  // If this cohort is active, deactivate other cohorts for this program
  if (data.isActive) {
    await prisma.cohort.updateMany({
      where: { programId: data.programId },
      data: { isActive: false },
    });
  }

  return prisma.cohort.create({
    data: {
      programId: data.programId,
      name: data.name,
      startYear: data.startYear,
      endYear: data.endYear,
      status: data.status || "DRAFT",
      isActive: data.isActive || false,
    },
  });
}

export type UpdateCohortInput = Partial<CreateCohortInput>;

export async function updateCohort(id: string, data: UpdateCohortInput) {
  // If setting this cohort as active, deactivate others
  if (data.isActive) {
    const cohort = await prisma.cohort.findUnique({ where: { id } });
    if (cohort) {
      await prisma.cohort.updateMany({
        where: { programId: cohort.programId, id: { not: id } },
        data: { isActive: false },
      });
    }
  }

  return prisma.cohort.update({
    where: { id },
    data,
  });
}

export async function deleteCohort(id: string) {
  return prisma.cohort.delete({
    where: { id },
  });
}

// Initialize a new cohort with default structure (4 years, 3 visions)
export async function initializeCohortStructure(cohortId: string) {
  const cohort = await prisma.cohort.findUnique({
    where: { id: cohortId },
    include: { program: true },
  });

  if (!cohort) throw new Error("Cohort not found");

  // Create 3 visions
  await prisma.vision.createMany({
    data: [
      {
        cohortId,
        type: "LEARNING",
        title: "Visie op Leren en Onderwijs",
        content: "",
        status: "DRAFT",
      },
      {
        cohortId,
        type: "PROFESSION",
        title: "Visie op het Beroep",
        content: "",
        status: "DRAFT",
      },
      {
        cohortId,
        type: "ASSESSMENT",
        title: "Visie op Toetsing en Examinering",
        content: "",
        status: "DRAFT",
      },
    ],
  });

  // Create academic years based on program duration
  const years = [];
  for (let i = 1; i <= cohort.program.durationYears; i++) {
    years.push({
      cohortId,
      yearNumber: i,
      name: i === 1 ? "Propedeuse" : `Hoofdfase ${i - 1}`,
      targetCredits: 60,
      sortOrder: i,
    });
  }
  await prisma.academicYear.createMany({ data: years });

  return getCohortById(cohortId);
}
