import prisma from "@/lib/prisma";
import type { AssessmentType, AssessmentForm, GradingModel } from "@prisma/client";

export type AssessmentWithRelations = Awaited<ReturnType<typeof getAssessmentById>>;

export async function getAssessments(blockId?: string) {
  return prisma.assessment.findMany({
    where: blockId ? { blockId } : undefined,
    include: {
      block: {
        include: {
          academicYear: true,
        },
      },
      teachingUnit: true,
      outcomes: {
        include: {
          outcome: true,
        },
      },
      _count: {
        select: {
          criteria: true,
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAssessmentById(id: string) {
  return prisma.assessment.findUnique({
    where: { id },
    include: {
      block: {
        include: {
          academicYear: {
            include: {
              cohort: {
                include: {
                  program: true,
                  learningOutcomes: {
                    orderBy: { sortOrder: "asc" },
                  },
                },
              },
            },
          },
        },
      },
      teachingUnit: true,
      outcomes: {
        include: {
          outcome: true,
        },
      },
      criteria: {
        orderBy: { sortOrder: "asc" },
        include: {
          outcome: true,
          rubricLevels: {
            orderBy: { level: "asc" },
          },
        },
      },
    },
  });
}

export type CreateAssessmentInput = {
  blockId: string;
  teachingUnitId?: string;
  code: string;
  title: string;
  description?: string;
  assessmentType?: AssessmentType;
  assessmentForm: AssessmentForm;
  isSummative?: boolean;
  weight?: number;
  credits: number;
  minimumGrade?: number;
  retakeAllowed?: number;
  gradingModel?: GradingModel;
  durationMinutes?: number;
  sortOrder?: number;
  outcomeIds?: string[];
};

export async function createAssessment(data: CreateAssessmentInput) {
  // Get the highest sortOrder if not provided
  if (data.sortOrder === undefined) {
    const lastAssessment = await prisma.assessment.findFirst({
      where: { blockId: data.blockId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastAssessment?.sortOrder ?? 0) + 1;
  }

  const { outcomeIds, ...assessmentData } = data;

  return prisma.assessment.create({
    data: {
      ...assessmentData,
      assessmentType: assessmentData.assessmentType || "SUMMATIVE",
      isSummative: assessmentData.isSummative ?? true,
      weight: assessmentData.weight ?? 100,
      minimumGrade: assessmentData.minimumGrade ?? 5.5,
      retakeAllowed: assessmentData.retakeAllowed ?? 2,
      gradingModel: assessmentData.gradingModel || "NUMERIC",
      outcomes: outcomeIds
        ? {
            create: outcomeIds.map((outcomeId) => ({
              outcomeId,
              weight: 100,
            })),
          }
        : undefined,
    },
    include: {
      outcomes: {
        include: {
          outcome: true,
        },
      },
    },
  });
}

export type UpdateAssessmentInput = Partial<Omit<CreateAssessmentInput, "blockId" | "outcomeIds">> & {
  outcomeIds?: string[];
};

export async function updateAssessment(id: string, data: UpdateAssessmentInput) {
  const { outcomeIds, ...assessmentData } = data;

  // Update outcome links if provided
  if (outcomeIds) {
    // Delete existing links
    await prisma.assessmentOutcome.deleteMany({
      where: { assessmentId: id },
    });

    // Create new links
    await prisma.assessmentOutcome.createMany({
      data: outcomeIds.map((outcomeId) => ({
        assessmentId: id,
        outcomeId,
        weight: 100,
      })),
    });
  }

  return prisma.assessment.update({
    where: { id },
    data: assessmentData,
    include: {
      outcomes: {
        include: {
          outcome: true,
        },
      },
    },
  });
}

export async function deleteAssessment(id: string) {
  return prisma.assessment.delete({
    where: { id },
  });
}

// Assessment Criteria
export type CreateCriterionInput = {
  assessmentId: string;
  outcomeId?: string;
  name: string;
  description: string;
  weight?: number;
  sortOrder?: number;
};

export async function createCriterion(data: CreateCriterionInput) {
  if (data.sortOrder === undefined) {
    const lastCriterion = await prisma.assessmentCriterion.findFirst({
      where: { assessmentId: data.assessmentId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastCriterion?.sortOrder ?? 0) + 1;
  }

  return prisma.assessmentCriterion.create({
    data: {
      assessmentId: data.assessmentId,
      outcomeId: data.outcomeId,
      name: data.name,
      description: data.description,
      weight: data.weight ?? 100,
      sortOrder: data.sortOrder,
    },
  });
}

export async function updateCriterion(
  id: string,
  data: Partial<Omit<CreateCriterionInput, "assessmentId">>
) {
  return prisma.assessmentCriterion.update({
    where: { id },
    data,
  });
}

export async function deleteCriterion(id: string) {
  return prisma.assessmentCriterion.delete({
    where: { id },
  });
}

// Rubric Levels
export type CreateRubricLevelInput = {
  criterionId: string;
  level: number;
  label: string;
  description: string;
  points: number;
};

export async function createRubricLevel(data: CreateRubricLevelInput) {
  return prisma.rubricLevel.create({
    data: {
      criterionId: data.criterionId,
      level: data.level,
      label: data.label,
      description: data.description,
      points: data.points,
      sortOrder: data.level,
    },
  });
}

export async function updateRubricLevel(
  id: string,
  data: Partial<Omit<CreateRubricLevelInput, "criterionId">>
) {
  return prisma.rubricLevel.update({
    where: { id },
    data,
  });
}

export async function deleteRubricLevel(id: string) {
  return prisma.rubricLevel.delete({
    where: { id },
  });
}
