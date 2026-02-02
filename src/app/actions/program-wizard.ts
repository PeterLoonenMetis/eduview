"use server";

import { revalidatePath } from "next/cache";
import { createProgram } from "@/lib/db/programs";
import { createMBOConfig } from "@/lib/db/mbo-config";
import { createHBOConfig } from "@/lib/db/hbo-config";
import { programSchema } from "@/lib/validations/program";

export type WizardActionResult = {
  success: boolean;
  error?: string;
  programId?: string;
};

export async function createHBOProgramAction(
  prevState: WizardActionResult,
  formData: FormData
): Promise<WizardActionResult> {
  // Validate program data
  const programData = {
    academyId: formData.get("academyId") as string,
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    crohoCode: (formData.get("crohoCode") as string) || undefined,
    educationType: "HBO" as const,
    degreeType: (formData.get("degreeType") as "BACHELOR" | "MASTER" | "ASSOCIATE") || "BACHELOR",
    durationYears: parseInt(formData.get("durationYears") as string) || 4,
    totalCredits: parseInt(formData.get("totalCredits") as string) || 240,
  };

  const programValidation = programSchema.safeParse(programData);
  if (!programValidation.success) {
    return {
      success: false,
      error: programValidation.error.issues.map((e) => e.message).join(", "),
    };
  }

  try {
    // Create the program
    const program = await createProgram(programValidation.data);

    // Create the HBO config
    const configData = {
      programId: program.id,
      domein: (formData.get("domein") as string) || undefined,
      variant: (formData.get("variant") as "VOLTIJD" | "DEELTIJD" | "DUAAL") || "VOLTIJD",
      toetsfilosofie:
        (formData.get("toetsfilosofie") as "PROGRAMMATISCH" | "TRADITIONEEL") || "TRADITIONEEL",
      ordeningsprincipe:
        (formData.get("ordeningsprincipe") as "PROJECTEN" | "VRAAGSTUKKEN" | "THEMAS") || "THEMAS",
      tijdsnede: (formData.get("tijdsnede") as "JAAR" | "SEMESTER" | "PERIODE") || "SEMESTER",
    };

    await createHBOConfig(configData);

    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo");

    return { success: true, programId: program.id };
  } catch (error) {
    console.error("Error creating HBO program:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de opleiding.",
    };
  }
}

export async function createMBOProgramAction(
  prevState: WizardActionResult,
  formData: FormData
): Promise<WizardActionResult> {
  // Validate program data
  const programData = {
    academyId: formData.get("academyId") as string,
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    educationType: "MBO" as const,
    durationYears: parseInt(formData.get("durationYears") as string) || 4,
    totalCredits: 0, // MBO doesn't use ECTS
    degreeType: "BACHELOR" as const, // Required but not used for MBO
  };

  const programValidation = programSchema.safeParse(programData);
  if (!programValidation.success) {
    return {
      success: false,
      error: programValidation.error.issues.map((e) => e.message).join(", "),
    };
  }

  try {
    // Create the program
    const program = await createProgram(programValidation.data);

    // Create the MBO config
    const configData = {
      programId: program.id,
      leerweg: (formData.get("leerweg") as "BOL" | "BBL") || "BOL",
      niveau:
        (formData.get("niveau") as "NIVEAU_1" | "NIVEAU_2" | "NIVEAU_3" | "NIVEAU_4") ||
        "NIVEAU_4",
      ontwerpprincipe:
        (formData.get("ontwerpprincipe") as "SCHOOL_PRIMAIR" | "BPV_PRIMAIR" | "HYBRIDE") ||
        "HYBRIDE",
      kdNaam: (formData.get("kdNaam") as string) || undefined,
      kdVersie: (formData.get("kdVersie") as string) || undefined,
      kdPeildatum: formData.get("kdPeildatum")
        ? new Date(formData.get("kdPeildatum") as string)
        : undefined,
    };

    await createMBOConfig(configData);

    revalidatePath("/demo/beheer/opleidingen");
    revalidatePath("/demo");

    return { success: true, programId: program.id };
  } catch (error) {
    console.error("Error creating MBO program:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het aanmaken van de opleiding.",
    };
  }
}
