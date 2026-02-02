"use server";

import { revalidatePath } from "next/cache";
import { hboConfigSchema, hboConfigUpdateSchema } from "@/lib/validations/hbo-config";
import * as db from "@/lib/db/hbo-config";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createHBOConfig(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    programId: formData.get("programId"),
    domein: formData.get("domein") || undefined,
    variant: formData.get("variant") || "VOLTIJD",
    toetsfilosofie: formData.get("toetsfilosofie") || "TRADITIONEEL",
    ordeningsprincipe: formData.get("ordeningsprincipe") || "THEMAS",
    tijdsnede: formData.get("tijdsnede") || "SEMESTER",
  };

  const validated = hboConfigSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const config = await db.createHBOConfig(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo/nieuw");
    return { success: true, data: config };
  } catch (error) {
    console.error("Error creating HBO config:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de HBO-configuratie.",
    };
  }
}

export async function updateHBOConfig(
  programId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    domein: formData.get("domein") || undefined,
    variant: formData.get("variant") || undefined,
    toetsfilosofie: formData.get("toetsfilosofie") || undefined,
    ordeningsprincipe: formData.get("ordeningsprincipe") || undefined,
    tijdsnede: formData.get("tijdsnede") || undefined,
  };

  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined)
  );

  const validated = hboConfigUpdateSchema.safeParse(cleanData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const config = await db.updateHBOConfig(programId, validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true, data: config };
  } catch (error) {
    console.error("Error updating HBO config:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het bijwerken van de HBO-configuratie.",
    };
  }
}

export async function deleteHBOConfig(programId: string): Promise<ActionResult> {
  try {
    await db.deleteHBOConfig(programId);
    revalidatePath("/demo/beheer/opleidingen");
    return { success: true };
  } catch (error) {
    console.error("Error deleting HBO config:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verwijderen van de HBO-configuratie.",
    };
  }
}
