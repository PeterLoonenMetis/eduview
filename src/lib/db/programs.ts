import prisma from "@/lib/prisma";
import type { DegreeType, EducationType } from "@prisma/client";

export type ProgramWithRelations = Awaited<ReturnType<typeof getProgramById>>;

export async function getPrograms(academyId?: string) {
  return prisma.program.findMany({
    where: academyId ? { academyId } : undefined,
    include: {
      academy: {
        include: {
          institute: true,
        },
      },
      cohorts: {
        orderBy: { startYear: "desc" },
      },
      _count: {
        select: { cohorts: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getProgramById(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: {
      academy: {
        include: {
          institute: true,
        },
      },
      cohorts: {
        orderBy: { startYear: "desc" },
        include: {
          _count: {
            select: {
              visions: true,
              learningOutcomes: true,
              academicYears: true,
            },
          },
        },
      },
      mboConfig: {
        include: {
          kerntaken: {
            orderBy: { sortOrder: "asc" },
            include: {
              werkprocessen: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
          keuzedelen: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      hboConfig: true,
    },
  });
}

export async function getProgramWithConfig(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: {
      mboConfig: {
        include: {
          kerntaken: {
            orderBy: { sortOrder: "asc" },
            include: {
              werkprocessen: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
          keuzedelen: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      hboConfig: true,
    },
  });
}

export type CreateProgramInput = {
  academyId: string;
  name: string;
  code: string;
  crohoCode?: string | null;
  educationType?: EducationType;
  degreeType?: DegreeType;
  durationYears?: number;
  totalCredits?: number;
};

export async function createProgram(data: CreateProgramInput) {
  return prisma.program.create({
    data: {
      academyId: data.academyId,
      name: data.name,
      code: data.code,
      crohoCode: data.crohoCode,
      educationType: data.educationType || "HBO",
      degreeType: data.degreeType || "BACHELOR",
      durationYears: data.durationYears || 4,
      totalCredits: data.totalCredits || 240,
    },
  });
}

export type UpdateProgramInput = Partial<Omit<CreateProgramInput, "educationType">>;

export async function updateProgram(id: string, data: UpdateProgramInput) {
  return prisma.program.update({
    where: { id },
    data,
  });
}

export async function deleteProgram(id: string) {
  return prisma.program.delete({
    where: { id },
  });
}

// Get programs filtered by education type
export async function getProgramsByEducationType(educationType: EducationType) {
  return prisma.program.findMany({
    where: { educationType },
    include: {
      academy: {
        include: {
          institute: true,
        },
      },
      cohorts: {
        orderBy: { startYear: "desc" },
      },
      _count: {
        select: { cohorts: true },
      },
    },
    orderBy: { name: "asc" },
  });
}
