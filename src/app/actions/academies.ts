"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as db from "@/lib/db/institutes";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

const instituteSchema = z.object({
  name: z.string().min(1, "Naam is verplicht").max(100),
  code: z.string().min(1, "Code is verplicht").max(20),
});

const academySchema = z.object({
  instituteId: z.string().min(1, "Selecteer een instituut"),
  name: z.string().min(1, "Naam is verplicht").max(100),
  code: z.string().min(1, "Code is verplicht").max(20),
  description: z.string().optional(),
});

// Create new institute (school)
export async function createInstituteDirect(data: {
  name: string;
  code: string;
}): Promise<ActionResult> {
  const validated = instituteSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const institute = await db.createInstitute(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo/beheer/opleidingen/nieuw");
    return { success: true, data: institute };
  } catch (error) {
    console.error("Error creating institute:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de school.",
    };
  }
}

export async function createAcademy(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    instituteId: formData.get("instituteId"),
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description") || undefined,
  };

  const validated = academySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const academy = await db.createAcademy(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo/beheer/opleidingen/nieuw");
    return { success: true, data: academy };
  } catch (error) {
    console.error("Error creating academy:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de academie.",
    };
  }
}

// Direct function for use in dialogs (not as form action)
export async function createAcademyDirect(data: {
  instituteId: string;
  name: string;
  code: string;
  description?: string;
}): Promise<ActionResult> {
  const validated = academySchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const academy = await db.createAcademy(validated.data);
    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo/beheer/opleidingen/nieuw");
    return { success: true, data: academy };
  } catch (error) {
    console.error("Error creating academy:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de academie.",
    };
  }
}
