import { z } from "zod";

export const visionRelationSchema = z.object({
  visionType: z.enum(["LEARNING", "PROFESSION", "ASSESSMENT"]),
  strength: z.enum(["STRONG", "MODERATE", "WEAK"]),
});

export const blockSchema = z.object({
  academicYearId: z.string().min(1, "Leerjaar is verplicht"),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  name: z.string().min(1, "Naam is verplicht").max(100, "Naam mag maximaal 100 tekens zijn"),
  shortDescription: z.string().min(1, "Korte beschrijving is verplicht").max(150, "Korte beschrijving mag maximaal 150 tekens zijn"),
  longDescription: z.string().optional(),
  type: z.enum(["EDUCATIONAL", "PROJECT", "PRACTICAL", "INTERNSHIP", "GRADUATION"]).default("EDUCATIONAL"),
  credits: z.coerce.number().min(1, "EC moet minimaal 1 zijn").max(60, "EC mag maximaal 60 zijn"),
  durationWeeks: z.coerce.number().min(1).max(40).default(10),
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "ARCHIVED"]).default("DRAFT"),
  color: z.string().optional(),
  sortOrder: z.coerce.number().min(0).optional(),
  visionRelations: z.array(visionRelationSchema).optional(),
});

export type BlockFormData = z.infer<typeof blockSchema>;

export const blockUpdateSchema = blockSchema.partial().omit({ academicYearId: true });

export type BlockUpdateData = z.infer<typeof blockUpdateSchema>;
