"use server";

import { revalidatePath } from "next/cache";
import { blockSchema, blockUpdateSchema } from "@/lib/validations/block";
import * as db from "@/lib/db/blocks";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createBlock(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const visionRelationsStr = formData.get("visionRelations");
  let visionRelations;
  if (visionRelationsStr) {
    try {
      visionRelations = JSON.parse(visionRelationsStr as string);
    } catch {
      visionRelations = undefined;
    }
  }

  const rawData = {
    academicYearId: formData.get("academicYearId"),
    code: formData.get("code"),
    name: formData.get("name"),
    shortDescription: formData.get("shortDescription"),
    longDescription: formData.get("longDescription") || undefined,
    type: formData.get("type") || "EDUCATIONAL",
    credits: formData.get("credits"),
    durationWeeks: formData.get("durationWeeks") || 10,
    status: formData.get("status") || "DRAFT",
    color: formData.get("color") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
    visionRelations,
  };

  const validated = blockSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const block = await db.createBlock(validated.data);
    revalidatePath("/demo/beheer/curriculum");
    revalidatePath("/demo/curriculum");
    return { success: true, data: block };
  } catch (error) {
    console.error("Error creating block:", error);
    return { success: false, error: "Er is een fout opgetreden bij het aanmaken van het blok." };
  }
}

export async function updateBlock(id: string, prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const visionRelationsStr = formData.get("visionRelations");
  let visionRelations;
  if (visionRelationsStr) {
    try {
      visionRelations = JSON.parse(visionRelationsStr as string);
    } catch {
      visionRelations = undefined;
    }
  }

  const rawData = {
    code: formData.get("code") || undefined,
    name: formData.get("name") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    longDescription: formData.get("longDescription") || undefined,
    type: formData.get("type") || undefined,
    credits: formData.get("credits") || undefined,
    durationWeeks: formData.get("durationWeeks") || undefined,
    status: formData.get("status") || undefined,
    color: formData.get("color") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
    visionRelations,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = blockUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const block = await db.updateBlock(id, validated.data);
    revalidatePath("/demo/beheer/curriculum");
    revalidatePath("/demo/curriculum");
    revalidatePath(`/demo/curriculum/blok/${id}`);
    return { success: true, data: block };
  } catch (error) {
    console.error("Error updating block:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken van het blok." };
  }
}

export async function deleteBlock(id: string): Promise<ActionResult> {
  try {
    await db.deleteBlock(id);
    revalidatePath("/demo/beheer/curriculum");
    revalidatePath("/demo/curriculum");
    return { success: true };
  } catch (error) {
    console.error("Error deleting block:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwijderen van het blok." };
  }
}

export async function reorderBlocks(academicYearId: string, blockIds: string[]): Promise<ActionResult> {
  try {
    const blocks = await db.reorderBlocks(academicYearId, blockIds);
    revalidatePath("/demo/beheer/curriculum");
    revalidatePath("/demo/curriculum");
    return { success: true, data: blocks };
  } catch (error) {
    console.error("Error reordering blocks:", error);
    return { success: false, error: "Er is een fout opgetreden bij het herordenen van de blokken." };
  }
}
