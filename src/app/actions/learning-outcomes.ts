"use server";

import { revalidatePath } from "next/cache";
import { learningOutcomeSchema, learningOutcomeUpdateSchema } from "@/lib/validations/learning-outcome";
import * as db from "@/lib/db/learning-outcomes";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createLearningOutcome(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const visionLinksStr = formData.get("visionLinks");
  let visionLinks;
  if (visionLinksStr) {
    try {
      visionLinks = JSON.parse(visionLinksStr as string);
    } catch {
      visionLinks = undefined;
    }
  }

  const rawData = {
    cohortId: formData.get("cohortId"),
    code: formData.get("code"),
    title: formData.get("title"),
    description: formData.get("description"),
    level: formData.get("level") || "APPLY",
    category: formData.get("category") || "SKILLS",
    sortOrder: formData.get("sortOrder") || undefined,
    visionLinks,
  };

  const validated = learningOutcomeSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const outcome = await db.createLearningOutcome(validated.data);
    revalidatePath("/demo/beheer/leeruitkomsten");
    revalidatePath("/demo/dashboard");
    return { success: true, data: outcome };
  } catch (error) {
    console.error("Error creating learning outcome:", error);
    return { success: false, error: "Er is een fout opgetreden bij het aanmaken van de leeruitkomst." };
  }
}

export async function updateLearningOutcome(id: string, prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const visionLinksStr = formData.get("visionLinks");
  let visionLinks;
  if (visionLinksStr) {
    try {
      visionLinks = JSON.parse(visionLinksStr as string);
    } catch {
      visionLinks = undefined;
    }
  }

  const rawData = {
    code: formData.get("code") || undefined,
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    level: formData.get("level") || undefined,
    category: formData.get("category") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
    visionLinks,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = learningOutcomeUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const outcome = await db.updateLearningOutcome(id, validated.data);
    revalidatePath("/demo/beheer/leeruitkomsten");
    revalidatePath("/demo/dashboard");
    return { success: true, data: outcome };
  } catch (error) {
    console.error("Error updating learning outcome:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken van de leeruitkomst." };
  }
}

export async function deleteLearningOutcome(id: string): Promise<ActionResult> {
  try {
    await db.deleteLearningOutcome(id);
    revalidatePath("/demo/beheer/leeruitkomsten");
    revalidatePath("/demo/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting learning outcome:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwijderen van de leeruitkomst." };
  }
}

export async function reorderLearningOutcomes(cohortId: string, outcomeIds: string[]): Promise<ActionResult> {
  try {
    const outcomes = await db.reorderLearningOutcomes(cohortId, outcomeIds);
    revalidatePath("/demo/beheer/leeruitkomsten");
    return { success: true, data: outcomes };
  } catch (error) {
    console.error("Error reordering learning outcomes:", error);
    return { success: false, error: "Er is een fout opgetreden bij het herordenen van de leeruitkomsten." };
  }
}
