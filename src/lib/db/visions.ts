import prisma from "@/lib/prisma";
import type { VisionType, ContentStatus } from "@prisma/client";

export type VisionWithPrinciples = Awaited<ReturnType<typeof getVisionById>>;

export async function getVisions(cohortId: string) {
  return prisma.vision.findMany({
    where: { cohortId },
    include: {
      principles: {
        orderBy: { sortOrder: "asc" },
      },
      _count: {
        select: { outcomeLinks: true },
      },
    },
    orderBy: { type: "asc" },
  });
}

export async function getVisionById(id: string) {
  return prisma.vision.findUnique({
    where: { id },
    include: {
      cohort: {
        include: {
          program: true,
        },
      },
      principles: {
        orderBy: { sortOrder: "asc" },
      },
      outcomeLinks: {
        include: {
          outcome: true,
        },
      },
    },
  });
}

export async function getVisionByType(cohortId: string, type: VisionType) {
  return prisma.vision.findUnique({
    where: {
      cohortId_type: { cohortId, type },
    },
    include: {
      principles: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export type UpdateVisionInput = {
  title?: string;
  content?: string;
  status?: ContentStatus;
};

export async function updateVision(id: string, data: UpdateVisionInput) {
  const updateData: any = { ...data };

  // If status is being set to APPROVED, set publishedAt
  if (data.status === "APPROVED") {
    updateData.publishedAt = new Date();
  }

  return prisma.vision.update({
    where: { id },
    data: updateData,
    include: {
      principles: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

// Vision Principles
export type CreatePrincipleInput = {
  visionId: string;
  title: string;
  description: string;
  sortOrder?: number;
};

export async function createPrinciple(data: CreatePrincipleInput) {
  // Get the highest sortOrder if not provided
  if (data.sortOrder === undefined) {
    const lastPrinciple = await prisma.visionPrinciple.findFirst({
      where: { visionId: data.visionId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastPrinciple?.sortOrder ?? 0) + 1;
  }

  return prisma.visionPrinciple.create({
    data: {
      visionId: data.visionId,
      title: data.title,
      description: data.description,
      sortOrder: data.sortOrder,
    },
  });
}

export type UpdatePrincipleInput = {
  title?: string;
  description?: string;
  sortOrder?: number;
};

export async function updatePrinciple(id: string, data: UpdatePrincipleInput) {
  return prisma.visionPrinciple.update({
    where: { id },
    data,
  });
}

export async function deletePrinciple(id: string) {
  return prisma.visionPrinciple.delete({
    where: { id },
  });
}

export async function reorderPrinciples(visionId: string, principleIds: string[]) {
  const updates = principleIds.map((id, index) =>
    prisma.visionPrinciple.update({
      where: { id },
      data: { sortOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return prisma.visionPrinciple.findMany({
    where: { visionId },
    orderBy: { sortOrder: "asc" },
  });
}
