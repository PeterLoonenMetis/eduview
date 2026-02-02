import prisma from "@/lib/prisma";
import type { BlockType, ContentStatus, VisionType, RelationStrength } from "@prisma/client";

export type BlockWithRelations = Awaited<ReturnType<typeof getBlockById>>;

export async function getBlocks(academicYearId?: string) {
  return prisma.block.findMany({
    where: academicYearId ? { academicYearId } : undefined,
    include: {
      academicYear: {
        include: {
          cohort: {
            include: {
              program: true,
            },
          },
        },
      },
      visionRelations: true,
      _count: {
        select: {
          teachingUnits: true,
          assessments: true,
        },
      },
    },
    orderBy: [{ academicYear: { yearNumber: "asc" } }, { sortOrder: "asc" }],
  });
}

export async function getBlocksByCohort(cohortId: string) {
  return prisma.block.findMany({
    where: {
      academicYear: { cohortId },
    },
    include: {
      academicYear: true,
      visionRelations: true,
      _count: {
        select: {
          teachingUnits: true,
          assessments: true,
        },
      },
    },
    orderBy: [{ academicYear: { yearNumber: "asc" } }, { sortOrder: "asc" }],
  });
}

export async function getBlockById(id: string) {
  return prisma.block.findUnique({
    where: { id },
    include: {
      academicYear: {
        include: {
          cohort: {
            include: {
              program: true,
              visions: true,
              learningOutcomes: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      },
      visionRelations: true,
      teachingUnits: {
        orderBy: { sortOrder: "asc" },
        include: {
          weekPlannings: {
            orderBy: { weekNumber: "asc" },
            include: {
              activities: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
          assignments: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      assessments: {
        orderBy: { sortOrder: "asc" },
        include: {
          outcomes: {
            include: {
              outcome: true,
            },
          },
          criteria: {
            orderBy: { sortOrder: "asc" },
            include: {
              rubricLevels: {
                orderBy: { level: "asc" },
              },
            },
          },
        },
      },
    },
  });
}

export type CreateBlockInput = {
  academicYearId: string;
  code: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  type?: BlockType;
  credits: number;
  durationWeeks?: number;
  status?: ContentStatus;
  color?: string;
  sortOrder?: number;
  visionRelations?: {
    visionType: VisionType;
    strength: RelationStrength;
  }[];
};

export async function createBlock(data: CreateBlockInput) {
  // Get the highest sortOrder if not provided
  if (data.sortOrder === undefined) {
    const lastBlock = await prisma.block.findFirst({
      where: { academicYearId: data.academicYearId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastBlock?.sortOrder ?? 0) + 1;
  }

  const { visionRelations, ...blockData } = data;

  return prisma.block.create({
    data: {
      ...blockData,
      type: blockData.type || "EDUCATIONAL",
      durationWeeks: blockData.durationWeeks || 10,
      status: blockData.status || "DRAFT",
      visionRelations: visionRelations
        ? {
            create: visionRelations.map((vr) => ({
              visionType: vr.visionType,
              strength: vr.strength,
            })),
          }
        : undefined,
    },
    include: {
      visionRelations: true,
    },
  });
}

export type UpdateBlockInput = Partial<Omit<CreateBlockInput, "academicYearId" | "visionRelations">> & {
  visionRelations?: {
    visionType: VisionType;
    strength: RelationStrength;
  }[];
};

export async function updateBlock(id: string, data: UpdateBlockInput) {
  const { visionRelations, ...blockData } = data;

  // Update vision relations if provided
  if (visionRelations) {
    // Delete existing relations
    await prisma.blockVisionRelation.deleteMany({
      where: { blockId: id },
    });

    // Create new relations
    await prisma.blockVisionRelation.createMany({
      data: visionRelations.map((vr) => ({
        blockId: id,
        visionType: vr.visionType,
        strength: vr.strength,
      })),
    });
  }

  return prisma.block.update({
    where: { id },
    data: blockData,
    include: {
      visionRelations: true,
    },
  });
}

export async function deleteBlock(id: string) {
  return prisma.block.delete({
    where: { id },
  });
}

export async function reorderBlocks(academicYearId: string, blockIds: string[]) {
  const updates = blockIds.map((id, index) =>
    prisma.block.update({
      where: { id },
      data: { sortOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return prisma.block.findMany({
    where: { academicYearId },
    orderBy: { sortOrder: "asc" },
  });
}

// Calculate total credits for an academic year
export async function calculateYearCredits(academicYearId: string) {
  const result = await prisma.block.aggregate({
    where: { academicYearId },
    _sum: { credits: true },
  });
  return result._sum.credits || 0;
}

// Calculate total credits for a cohort
export async function calculateCohortCredits(cohortId: string) {
  const result = await prisma.block.aggregate({
    where: { academicYear: { cohortId } },
    _sum: { credits: true },
  });
  return result._sum.credits || 0;
}
