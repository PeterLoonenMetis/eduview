import prisma from "@/lib/prisma";
import type { HBOVariant, HBOToetsfilosofie, HBOOrdeningsprincipe, HBOTijdsnede } from "@prisma/client";

// ============================================
// HBO CONFIG OPERATIONS
// ============================================

export type HBOConfigWithRelations = Awaited<ReturnType<typeof getHBOConfigByProgramId>>;

export async function getHBOConfigByProgramId(programId: string) {
  return prisma.hBOConfig.findUnique({
    where: { programId },
  });
}

export type CreateHBOConfigInput = {
  programId: string;
  domein?: string;
  variant?: HBOVariant;
  toetsfilosofie?: HBOToetsfilosofie;
  ordeningsprincipe?: HBOOrdeningsprincipe;
  tijdsnede?: HBOTijdsnede;
};

export async function createHBOConfig(data: CreateHBOConfigInput) {
  return prisma.hBOConfig.create({
    data: {
      programId: data.programId,
      domein: data.domein,
      variant: data.variant || "VOLTIJD",
      toetsfilosofie: data.toetsfilosofie || "TRADITIONEEL",
      ordeningsprincipe: data.ordeningsprincipe || "THEMAS",
      tijdsnede: data.tijdsnede || "SEMESTER",
    },
  });
}

export type UpdateHBOConfigInput = Partial<Omit<CreateHBOConfigInput, "programId">>;

export async function updateHBOConfig(programId: string, data: UpdateHBOConfigInput) {
  return prisma.hBOConfig.update({
    where: { programId },
    data,
  });
}

export async function deleteHBOConfig(programId: string) {
  return prisma.hBOConfig.delete({
    where: { programId },
  });
}

export async function upsertHBOConfig(programId: string, data: CreateHBOConfigInput) {
  return prisma.hBOConfig.upsert({
    where: { programId },
    update: {
      domein: data.domein,
      variant: data.variant,
      toetsfilosofie: data.toetsfilosofie,
      ordeningsprincipe: data.ordeningsprincipe,
      tijdsnede: data.tijdsnede,
    },
    create: {
      programId: data.programId,
      domein: data.domein,
      variant: data.variant || "VOLTIJD",
      toetsfilosofie: data.toetsfilosofie || "TRADITIONEEL",
      ordeningsprincipe: data.ordeningsprincipe || "THEMAS",
      tijdsnede: data.tijdsnede || "SEMESTER",
    },
  });
}
