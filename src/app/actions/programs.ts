"use server";

import { revalidatePath } from "next/cache";
import { programSchema, programUpdateSchema } from "@/lib/validations/program";
import * as db from "@/lib/db/programs";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createProgram(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    academyId: formData.get("academyId"),
    name: formData.get("name"),
    code: formData.get("code"),
    crohoCode: formData.get("crohoCode") || undefined,
    educationType: formData.get("educationType") || "MBO",
    degreeType: formData.get("degreeType") || "MBO4",
    durationYears: formData.get("durationYears"),
    totalCredits: formData.get("totalCredits"),
  };

  const validated = programSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const program = await db.createProgram(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: program };
  } catch (error) {
    console.error("Error creating program:", error);
    return { success: false, error: "Er is een fout opgetreden bij het aanmaken van de opleiding." };
  }
}

export async function updateProgram(id: string, prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") || undefined,
    code: formData.get("code") || undefined,
    crohoCode: formData.get("crohoCode") || undefined,
    degreeType: formData.get("degreeType") || undefined,
    durationYears: formData.get("durationYears") || undefined,
    totalCredits: formData.get("totalCredits") || undefined,
  };

  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = programUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const program = await db.updateProgram(id, validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath(`/demo/beheer/opleidingen/${id}`);
    return { success: true, data: program };
  } catch (error) {
    console.error("Error updating program:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken van de opleiding." };
  }
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  try {
    await db.deleteProgram(id);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true };
  } catch (error) {
    console.error("Error deleting program:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwijderen van de opleiding." };
  }
}
