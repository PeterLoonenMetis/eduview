import prisma from "@/lib/prisma";
import type { MBOLeerweg, MBONiveau, MBOOntwerpprincipe } from "@prisma/client";

// ============================================
// MBO CONFIG OPERATIONS
// ============================================

export type MBOConfigWithRelations = Awaited<ReturnType<typeof getMBOConfigByProgramId>>;

export async function getMBOConfigByProgramId(programId: string) {
  return prisma.mBOConfig.findUnique({
    where: { programId },
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
  });
}

export type CreateMBOConfigInput = {
  programId: string;
  leerweg?: MBOLeerweg;
  niveau?: MBONiveau;
  ontwerpprincipe?: MBOOntwerpprincipe;
  kdNaam?: string;
  kdVersie?: string;
  kdPeildatum?: Date;
};

export async function createMBOConfig(data: CreateMBOConfigInput) {
  return prisma.mBOConfig.create({
    data: {
      programId: data.programId,
      leerweg: data.leerweg || "BOL",
      niveau: data.niveau || "NIVEAU_4",
      ontwerpprincipe: data.ontwerpprincipe || "HYBRIDE",
      kdNaam: data.kdNaam,
      kdVersie: data.kdVersie,
      kdPeildatum: data.kdPeildatum,
    },
    include: {
      kerntaken: {
        include: { werkprocessen: true },
      },
      keuzedelen: true,
    },
  });
}

export type UpdateMBOConfigInput = Partial<Omit<CreateMBOConfigInput, "programId">>;

export async function updateMBOConfig(programId: string, data: UpdateMBOConfigInput) {
  return prisma.mBOConfig.update({
    where: { programId },
    data,
    include: {
      kerntaken: {
        include: { werkprocessen: true },
      },
      keuzedelen: true,
    },
  });
}

export async function deleteMBOConfig(programId: string) {
  return prisma.mBOConfig.delete({
    where: { programId },
  });
}

// ============================================
// KERNTAAK OPERATIONS
// ============================================

export type CreateKerntaakInput = {
  mboConfigId: string;
  code: string;
  naam: string;
  beschrijving?: string;
  sortOrder?: number;
};

export async function createKerntaak(data: CreateKerntaakInput) {
  return prisma.kerntaak.create({
    data: {
      mboConfigId: data.mboConfigId,
      code: data.code,
      naam: data.naam,
      beschrijving: data.beschrijving,
      sortOrder: data.sortOrder || 0,
    },
    include: {
      werkprocessen: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export type UpdateKerntaakInput = Partial<Omit<CreateKerntaakInput, "mboConfigId">>;

export async function updateKerntaak(id: string, data: UpdateKerntaakInput) {
  return prisma.kerntaak.update({
    where: { id },
    data,
    include: {
      werkprocessen: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function deleteKerntaak(id: string) {
  return prisma.kerntaak.delete({
    where: { id },
  });
}

export async function getKerntakenByMBOConfigId(mboConfigId: string) {
  return prisma.kerntaak.findMany({
    where: { mboConfigId },
    orderBy: { sortOrder: "asc" },
    include: {
      werkprocessen: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

// ============================================
// WERKPROCES OPERATIONS
// ============================================

export type CreateWerkprocesInput = {
  kerntaakId: string;
  code: string;
  naam: string;
  beschrijving?: string;
  sortOrder?: number;
};

export async function createWerkproces(data: CreateWerkprocesInput) {
  return prisma.werkproces.create({
    data: {
      kerntaakId: data.kerntaakId,
      code: data.code,
      naam: data.naam,
      beschrijving: data.beschrijving,
      sortOrder: data.sortOrder || 0,
    },
  });
}

export type UpdateWerkprocesInput = Partial<Omit<CreateWerkprocesInput, "kerntaakId">>;

export async function updateWerkproces(id: string, data: UpdateWerkprocesInput) {
  return prisma.werkproces.update({
    where: { id },
    data,
  });
}

export async function deleteWerkproces(id: string) {
  return prisma.werkproces.delete({
    where: { id },
  });
}

export async function getWerkprocessenByKerntaakId(kerntaakId: string) {
  return prisma.werkproces.findMany({
    where: { kerntaakId },
    orderBy: { sortOrder: "asc" },
  });
}

// ============================================
// KEUZEDEEL OPERATIONS
// ============================================

export type CreateKeuzedeelInput = {
  mboConfigId: string;
  code: string;
  naam: string;
  studiepunten?: number;
  beschrijving?: string;
  sortOrder?: number;
};

export async function createKeuzedeel(data: CreateKeuzedeelInput) {
  return prisma.keuzedeel.create({
    data: {
      mboConfigId: data.mboConfigId,
      code: data.code,
      naam: data.naam,
      studiepunten: data.studiepunten || 0,
      beschrijving: data.beschrijving,
      sortOrder: data.sortOrder || 0,
    },
  });
}

export type UpdateKeuzedeelInput = Partial<Omit<CreateKeuzedeelInput, "mboConfigId">>;

export async function updateKeuzedeel(id: string, data: UpdateKeuzedeelInput) {
  return prisma.keuzedeel.update({
    where: { id },
    data,
  });
}

export async function deleteKeuzedeel(id: string) {
  return prisma.keuzedeel.delete({
    where: { id },
  });
}

export async function getKeuzedelenByMBOConfigId(mboConfigId: string) {
  return prisma.keuzedeel.findMany({
    where: { mboConfigId },
    orderBy: { sortOrder: "asc" },
  });
}
