import { z } from "zod";

// Base schema without refinements (for .partial() support)
export const programBaseSchema = z.object({
  academyId: z.string().min(1, "Academie is verplicht"),
  name: z.string().min(1, "Naam is verplicht").max(100, "Naam mag maximaal 100 tekens zijn"),
  code: z.string().min(1, "Code is verplicht").max(10, "Code mag maximaal 10 tekens zijn"),
  crohoCode: z.string().max(10).optional().nullable(),
  educationType: z.enum(["MBO", "HBO"]).default("HBO"),
  degreeType: z.enum(["BACHELOR", "MASTER", "ASSOCIATE", "MBO4", "MBO3", "MBO2"]).default("BACHELOR"),
  durationYears: z.coerce.number().min(1).max(6).default(4),
  totalCredits: z.coerce.number().min(0).max(300).default(240),
});

// Full schema with refinements for create
export const programSchema = programBaseSchema;

export type ProgramFormData = z.infer<typeof programSchema>;

// Update schema - partial without academyId and educationType
export const programUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  code: z.string().min(1).max(10).optional(),
  crohoCode: z.string().max(10).optional().nullable(),
  degreeType: z.enum(["BACHELOR", "MASTER", "ASSOCIATE", "MBO4", "MBO3", "MBO2"]).optional(),
  durationYears: z.coerce.number().min(1).max(6).optional(),
  totalCredits: z.coerce.number().min(0).max(300).optional(),
});

export type ProgramUpdateData = z.infer<typeof programUpdateSchema>;
