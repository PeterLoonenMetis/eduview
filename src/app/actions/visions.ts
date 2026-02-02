"use server";

import { revalidatePath } from "next/cache";
import { visionSchema, principleSchema, principleUpdateSchema } from "@/lib/validations/vision";
import * as db from "@/lib/db/visions";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function updateVision(id: string, prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    title: formData.get("title") || undefined,
    content: formData.get("content") || undefined,
    status: formData.get("status") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = visionSchema.partial().safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const vision = await db.updateVision(id, validated.data);
    revalidatePath("/demo/beheer/visies");
    revalidatePath("/demo/visie");
    return { success: true, data: vision };
  } catch (error) {
    console.error("Error updating vision:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken van de visie." };
  }
}

// Principles
export async function createPrinciple(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    visionId: formData.get("visionId"),
    title: formData.get("title"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder") || undefined,
  };

  const validated = principleSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const principle = await db.createPrinciple(validated.data);
    revalidatePath("/demo/beheer/visies");
    revalidatePath("/demo/visie");
    return { success: true, data: principle };
  } catch (error) {
    console.error("Error creating principle:", error);
    return { success: false, error: "Er is een fout opgetreden bij het aanmaken van het uitgangspunt." };
  }
}

export async function updatePrinciple(id: string, prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const rawData = {
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = principleUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const principle = await db.updatePrinciple(id, validated.data);
    revalidatePath("/demo/beheer/visies");
    revalidatePath("/demo/visie");
    return { success: true, data: principle };
  } catch (error) {
    console.error("Error updating principle:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken van het uitgangspunt." };
  }
}

export async function deletePrinciple(id: string): Promise<ActionResult> {
  try {
    await db.deletePrinciple(id);
    revalidatePath("/demo/beheer/visies");
    revalidatePath("/demo/visie");
    return { success: true };
  } catch (error) {
    console.error("Error deleting principle:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwijderen van het uitgangspunt." };
  }
}

export async function reorderPrinciples(visionId: string, principleIds: string[]): Promise<ActionResult> {
  try {
    const principles = await db.reorderPrinciples(visionId, principleIds);
    revalidatePath("/demo/beheer/visies");
    revalidatePath("/demo/visie");
    return { success: true, data: principles };
  } catch (error) {
    console.error("Error reordering principles:", error);
    return { success: false, error: "Er is een fout opgetreden bij het herordenen van de uitgangspunten." };
  }
}
