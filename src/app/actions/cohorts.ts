"use server";

import { revalidatePath } from "next/cache";
import { cohortSchema, cohortUpdateSchema } from "@/lib/validations/cohort";
import * as db from "@/lib/db/cohorts";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createCohort(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    programId: formData.get("programId"),
    name: formData.get("name"),
    startYear: formData.get("startYear"),
    endYear: formData.get("endYear"),
    status: formData.get("status") || "DRAFT",
    isActive: formData.get("isActive") === "true",
  };

  const validated = cohortSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const cohort = await db.createCohort(validated.data);
    revalidatePath("/demo/beheer/cohorten");
    return { success: true, data: cohort };
  } catch (error) {
    console.error("Error creating cohort:", error);
    return { success: false, error: "Er is een fout opgetreden bij het aanmaken van het cohort." };
  }
}

export async function updateCohort(id: string, prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") || undefined,
    startYear: formData.get("startYear") || undefined,
    endYear: formData.get("endYear") || undefined,
    status: formData.get("status") || undefined,
    isActive: formData.has("isActive") ? formData.get("isActive") === "true" : undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = cohortUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const cohort = await db.updateCohort(id, validated.data);
    revalidatePath("/demo/beheer/cohorten");
    revalidatePath(`/demo/beheer/cohorten/${id}`);
    return { success: true, data: cohort };
  } catch (error) {
    console.error("Error updating cohort:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken van het cohort." };
  }
}

export async function deleteCohort(id: string): Promise<ActionResult> {
  try {
    await db.deleteCohort(id);
    revalidatePath("/demo/beheer/cohorten");
    return { success: true };
  } catch (error) {
    console.error("Error deleting cohort:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwijderen van het cohort." };
  }
}

export async function initializeCohort(id: string): Promise<ActionResult> {
  try {
    const cohort = await db.initializeCohortStructure(id);
    revalidatePath("/demo/beheer/cohorten");
    revalidatePath(`/demo/beheer/cohorten/${id}`);
    return { success: true, data: cohort };
  } catch (error) {
    console.error("Error initializing cohort:", error);
    return { success: false, error: "Er is een fout opgetreden bij het initialiseren van het cohort." };
  }
}
