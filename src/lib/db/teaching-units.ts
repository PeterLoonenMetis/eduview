import prisma from "@/lib/prisma";
import type { ActivityType, AssignmentType, WorkForm } from "@prisma/client";

export type TeachingUnitWithRelations = Awaited<ReturnType<typeof getTeachingUnitById>>;

export async function getTeachingUnits(blockId: string) {
  return prisma.teachingUnit.findMany({
    where: { blockId },
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
      _count: {
        select: {
          assessments: true,
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getTeachingUnitById(id: string) {
  return prisma.teachingUnit.findUnique({
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
      weekPlannings: {
        orderBy: { weekNumber: "asc" },
        include: {
          activities: {
            orderBy: { sortOrder: "asc" },
          },
          assignments: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      assignments: {
        orderBy: { sortOrder: "asc" },
        include: {
          outcomes: {
            include: {
              outcome: true,
            },
          },
        },
      },
      assessments: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export type CreateTeachingUnitInput = {
  blockId: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  contactHours?: number;
  selfStudyHours?: number;
  sortOrder?: number;
};

export async function createTeachingUnit(data: CreateTeachingUnitInput) {
  if (data.sortOrder === undefined) {
    const lastUnit = await prisma.teachingUnit.findFirst({
      where: { blockId: data.blockId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastUnit?.sortOrder ?? 0) + 1;
  }

  return prisma.teachingUnit.create({
    data: {
      blockId: data.blockId,
      code: data.code,
      name: data.name,
      description: data.description,
      credits: data.credits,
      contactHours: data.contactHours ?? 0,
      selfStudyHours: data.selfStudyHours ?? 0,
      sortOrder: data.sortOrder,
    },
  });
}

export type UpdateTeachingUnitInput = Partial<Omit<CreateTeachingUnitInput, "blockId">>;

export async function updateTeachingUnit(id: string, data: UpdateTeachingUnitInput) {
  return prisma.teachingUnit.update({
    where: { id },
    data,
  });
}

export async function deleteTeachingUnit(id: string) {
  return prisma.teachingUnit.delete({
    where: { id },
  });
}

// Week Planning
export type CreateWeekPlanningInput = {
  teachingUnitId: string;
  weekNumber: number;
  theme: string;
  learningGoals?: string;
};

export async function createWeekPlanning(data: CreateWeekPlanningInput) {
  return prisma.weekPlanning.create({
    data: {
      teachingUnitId: data.teachingUnitId,
      weekNumber: data.weekNumber,
      theme: data.theme,
      learningGoals: data.learningGoals,
    },
  });
}

export async function updateWeekPlanning(
  id: string,
  data: Partial<Omit<CreateWeekPlanningInput, "teachingUnitId">>
) {
  return prisma.weekPlanning.update({
    where: { id },
    data,
  });
}

export async function deleteWeekPlanning(id: string) {
  return prisma.weekPlanning.delete({
    where: { id },
  });
}

// Learning Activities
export type CreateActivityInput = {
  weekPlanningId: string;
  name: string;
  description?: string;
  activityType?: ActivityType;
  durationMinutes?: number;
  materials?: string;
  sortOrder?: number;
};

export async function createActivity(data: CreateActivityInput) {
  if (data.sortOrder === undefined) {
    const lastActivity = await prisma.learningActivity.findFirst({
      where: { weekPlanningId: data.weekPlanningId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastActivity?.sortOrder ?? 0) + 1;
  }

  return prisma.learningActivity.create({
    data: {
      weekPlanningId: data.weekPlanningId,
      name: data.name,
      description: data.description,
      activityType: data.activityType || "LECTURE",
      durationMinutes: data.durationMinutes ?? 90,
      materials: data.materials,
      sortOrder: data.sortOrder,
    },
  });
}

export async function updateActivity(
  id: string,
  data: Partial<Omit<CreateActivityInput, "weekPlanningId">>
) {
  return prisma.learningActivity.update({
    where: { id },
    data,
  });
}

export async function deleteActivity(id: string) {
  return prisma.learningActivity.delete({
    where: { id },
  });
}

// Assignments
export type CreateAssignmentInput = {
  teachingUnitId: string;
  weekPlanningId?: string;
  code: string;
  title: string;
  description: string;
  assignmentType?: AssignmentType;
  workForm?: WorkForm;
  isGroup?: boolean;
  groupSizeMin?: number;
  groupSizeMax?: number;
  estimatedHours?: number;
  dueWeek?: number;
  sortOrder?: number;
  outcomeIds?: string[];
};

export async function createAssignment(data: CreateAssignmentInput) {
  if (data.sortOrder === undefined) {
    const lastAssignment = await prisma.assignment.findFirst({
      where: { teachingUnitId: data.teachingUnitId },
      orderBy: { sortOrder: "desc" },
    });
    data.sortOrder = (lastAssignment?.sortOrder ?? 0) + 1;
  }

  const { outcomeIds, ...assignmentData } = data;

  return prisma.assignment.create({
    data: {
      ...assignmentData,
      assignmentType: assignmentData.assignmentType || "SKILL",
      workForm: assignmentData.workForm || "INDIVIDUAL",
      isGroup: assignmentData.isGroup ?? false,
      outcomes: outcomeIds
        ? {
            create: outcomeIds.map((outcomeId) => ({
              outcomeId,
              contribution: "PRIMARY",
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

export async function updateAssignment(
  id: string,
  data: Partial<Omit<CreateAssignmentInput, "teachingUnitId" | "outcomeIds">> & {
    outcomeIds?: string[];
  }
) {
  const { outcomeIds, ...assignmentData } = data;

  if (outcomeIds) {
    await prisma.assignmentOutcome.deleteMany({
      where: { assignmentId: id },
    });

    await prisma.assignmentOutcome.createMany({
      data: outcomeIds.map((outcomeId) => ({
        assignmentId: id,
        outcomeId,
        contribution: "PRIMARY" as const,
      })),
    });
  }

  return prisma.assignment.update({
    where: { id },
    data: assignmentData,
    include: {
      outcomes: {
        include: {
          outcome: true,
        },
      },
    },
  });
}

export async function deleteAssignment(id: string) {
  return prisma.assignment.delete({
    where: { id },
  });
}
