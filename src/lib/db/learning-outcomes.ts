import prisma from "@/lib/prisma";
import type { BloomLevel, OutcomeCategory, RelevanceLevel, VisionType } from "@prisma/client";

export type LearningOutcomeWithRelations = Awaited<ReturnType<typeof getLearningOutcomeById>>;

export async function getLearningOutcomes(cohortId: string) {
  return prisma.learningOutcome.findMany({
    where: { cohortId },
    include: {
      visionLinks: {
        include: {
          vision: true,
        },
      },
      _count: {
        select: {
          assessmentOutcomes: true,
          assignmentOutcomes: true,
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getLearningOutcomeById(id: string) {
  return prisma.learningOutcome.findUnique({
    where: { id },
    include: {
      cohort: {
        include: {
          program: true,
        },
      },
      visionLinks: {
        include: {
          vision: true,
        },
      },
      assessmentOutcomes: {
        include: {
          assessment: {
            include: {
              block: true,
            },
          },
        },
      },
      assignmentOutcomes: {
        include: {
          assignment: {
            include: {
              teachingUnit: {
                include: {
                  block: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export type CreateLearningOutcomeInput = {
  cohortId: string;
  code: string;
  title: string;
  description: string;
  level?: BloomLevel;
  category?: OutcomeCategory;
  sortOrder?: number;
  visionLinks?: {
    visionId: string;
    relevance?: RelevanceLevel;
  }[];
};

export async function createLearningOutcome(data: CreateLearningOutcomeInput) {
  // Get the highest sortOrder if not provided
  if (data.sortOrder === undefined) {
    const lastOutcome = await prisma.learningOutcome.findFirst({
      where: { cohortId: data.cohortId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastOutcome?.sortOrder ?? 0) + 1;
  }

  const { visionLinks, ...outcomeData } = data;

  return prisma.learningOutcome.create({
    data: {
      ...outcomeData,
      level: outcomeData.level || "APPLY",
      category: outcomeData.category || "SKILLS",
      visionLinks: visionLinks
        ? {
            create: visionLinks.map((vl) => ({
              visionId: vl.visionId,
              relevance: vl.relevance || "PRIMARY",
            })),
          }
        : undefined,
    },
    include: {
      visionLinks: {
        include: {
          vision: true,
        },
      },
    },
  });
}

export type UpdateLearningOutcomeInput = Partial<Omit<CreateLearningOutcomeInput, "cohortId" | "visionLinks">> & {
  visionLinks?: {
    visionId: string;
    relevance?: RelevanceLevel;
  }[];
};

export async function updateLearningOutcome(id: string, data: UpdateLearningOutcomeInput) {
  const { visionLinks, ...outcomeData } = data;

  // Update vision links if provided
  if (visionLinks) {
    // Delete existing links
    await prisma.outcomeVisionLink.deleteMany({
      where: { outcomeId: id },
    });

    // Create new links
    await prisma.outcomeVisionLink.createMany({
      data: visionLinks.map((vl) => ({
        outcomeId: id,
        visionId: vl.visionId,
        relevance: vl.relevance || "PRIMARY",
      })),
    });
  }

  return prisma.learningOutcome.update({
    where: { id },
    data: outcomeData,
    include: {
      visionLinks: {
        include: {
          vision: true,
        },
      },
    },
  });
}

export async function deleteLearningOutcome(id: string) {
  return prisma.learningOutcome.delete({
    where: { id },
  });
}

export async function reorderLearningOutcomes(cohortId: string, outcomeIds: string[]) {
  const updates = outcomeIds.map((id, index) =>
    prisma.learningOutcome.update({
      where: { id },
      data: { sortOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return prisma.learningOutcome.findMany({
    where: { cohortId },
    orderBy: { sortOrder: "asc" },
  });
}

// Get coverage matrix data: which outcomes are covered by which blocks
export async function getOutcomeCoverageMatrix(cohortId: string) {
  const outcomes = await prisma.learningOutcome.findMany({
    where: { cohortId },
    orderBy: { sortOrder: "asc" },
  });

  const blocks = await prisma.block.findMany({
    where: { academicYear: { cohortId } },
    orderBy: [{ academicYear: { yearNumber: "asc" } }, { sortOrder: "asc" }],
    include: {
      academicYear: true,
      assessments: {
        include: {
          outcomes: true,
        },
      },
    },
  });

  // Build coverage matrix
  const matrix = outcomes.map((outcome) => {
    const coverage = blocks.map((block) => {
      const isAssessed = block.assessments.some((assessment) =>
        assessment.outcomes.some((ao) => ao.outcomeId === outcome.id)
      );
      return {
        blockId: block.id,
        blockCode: block.code,
        blockName: block.name,
        yearNumber: block.academicYear.yearNumber,
        isAssessed,
      };
    });

    return {
      outcomeId: outcome.id,
      outcomeCode: outcome.code,
      outcomeTitle: outcome.title,
      coverage,
      totalAssessments: coverage.filter((c) => c.isAssessed).length,
    };
  });

  return {
    outcomes,
    blocks,
    matrix,
  };
}
