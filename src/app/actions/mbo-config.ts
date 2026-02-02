"use server";

import { revalidatePath } from "next/cache";
import {
  mboConfigSchema,
  mboConfigUpdateSchema,
  kerntaakSchema,
  kerntaakUpdateSchema,
  werkprocesSchema,
  werkprocesUpdateSchema,
  keuzedeelSchema,
  keuzedeelUpdateSchema,
} from "@/lib/validations/mbo-config";
import * as db from "@/lib/db/mbo-config";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

// ============================================
// MBO CONFIG ACTIONS
// ============================================

export async function createMBOConfig(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    programId: formData.get("programId"),
    leerweg: formData.get("leerweg") || "BOL",
    niveau: formData.get("niveau") || "NIVEAU_4",
    ontwerpprincipe: formData.get("ontwerpprincipe") || "HYBRIDE",
    kdNaam: formData.get("kdNaam") || undefined,
    kdVersie: formData.get("kdVersie") || undefined,
    kdPeildatum: formData.get("kdPeildatum") || undefined,
  };

  const validated = mboConfigSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const config = await db.createMBOConfig(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo/nieuw");
    return { success: true, data: config };
  } catch (error) {
    console.error("Error creating MBO config:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de MBO-configuratie.",
    };
  }
}

export async function updateMBOConfig(
  programId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    leerweg: formData.get("leerweg") || undefined,
    niveau: formData.get("niveau") || undefined,
    ontwerpprincipe: formData.get("ontwerpprincipe") || undefined,
    kdNaam: formData.get("kdNaam") || undefined,
    kdVersie: formData.get("kdVersie") || undefined,
    kdPeildatum: formData.get("kdPeildatum") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = mboConfigUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const config = await db.updateMBOConfig(programId, validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: config };
  } catch (error) {
    console.error("Error updating MBO config:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het bijwerken van de MBO-configuratie.",
    };
  }
}

// ============================================
// KERNTAAK ACTIONS
// ============================================

export async function createKerntaak(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    mboConfigId: formData.get("mboConfigId"),
    code: formData.get("code"),
    naam: formData.get("naam"),
    beschrijving: formData.get("beschrijving") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const validated = kerntaakSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const kerntaak = await db.createKerntaak(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: kerntaak };
  } catch (error) {
    console.error("Error creating kerntaak:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de kerntaak.",
    };
  }
}

export async function updateKerntaak(
  id: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    code: formData.get("code") || undefined,
    naam: formData.get("naam") || undefined,
    beschrijving: formData.get("beschrijving") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = kerntaakUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const kerntaak = await db.updateKerntaak(id, validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: kerntaak };
  } catch (error) {
    console.error("Error updating kerntaak:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het bijwerken van de kerntaak.",
    };
  }
}

export async function deleteKerntaak(id: string): Promise<ActionResult> {
  try {
    await db.deleteKerntaak(id);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true };
  } catch (error) {
    console.error("Error deleting kerntaak:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verwijderen van de kerntaak.",
    };
  }
}

// ============================================
// WERKPROCES ACTIONS
// ============================================

export async function createWerkproces(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    kerntaakId: formData.get("kerntaakId"),
    code: formData.get("code"),
    naam: formData.get("naam"),
    beschrijving: formData.get("beschrijving") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const validated = werkprocesSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const werkproces = await db.createWerkproces(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: werkproces };
  } catch (error) {
    console.error("Error creating werkproces:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van het werkproces.",
    };
  }
}

export async function updateWerkproces(
  id: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    code: formData.get("code") || undefined,
    naam: formData.get("naam") || undefined,
    beschrijving: formData.get("beschrijving") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = werkprocesUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const werkproces = await db.updateWerkproces(id, validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: werkproces };
  } catch (error) {
    console.error("Error updating werkproces:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het bijwerken van het werkproces.",
    };
  }
}

export async function deleteWerkproces(id: string): Promise<ActionResult> {
  try {
    await db.deleteWerkproces(id);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true };
  } catch (error) {
    console.error("Error deleting werkproces:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verwijderen van het werkproces.",
    };
  }
}

// ============================================
// KEUZEDEEL ACTIONS
// ============================================

export async function createKeuzedeel(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    mboConfigId: formData.get("mboConfigId"),
    code: formData.get("code"),
    naam: formData.get("naam"),
    studiepunten: formData.get("studiepunten") || 0,
    beschrijving: formData.get("beschrijving") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  };

  const validated = keuzedeelSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const keuzedeel = await db.createKeuzedeel(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: keuzedeel };
  } catch (error) {
    console.error("Error creating keuzedeel:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van het keuzedeel.",
    };
  }
}

export async function updateKeuzedeel(
  id: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    code: formData.get("code") || undefined,
    naam: formData.get("naam") || undefined,
    studiepunten: formData.get("studiepunten") || undefined,
    beschrijving: formData.get("beschrijving") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = keuzedeelUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const keuzedeel = await db.updateKeuzedeel(id, validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: keuzedeel };
  } catch (error) {
    console.error("Error updating keuzedeel:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het bijwerken van het keuzedeel.",
    };
  }
}

export async function deleteKeuzedeel(id: string): Promise<ActionResult> {
  try {
    await db.deleteKeuzedeel(id);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true };
  } catch (error) {
    console.error("Error deleting keuzedeel:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verwijderen van het keuzedeel.",
    };
  }
}
