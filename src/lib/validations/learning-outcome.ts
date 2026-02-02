import { z } from "zod";

export const learningOutcomeSchema = z.object({
  cohortId: z.string().min(1, "Cohort is verplicht"),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  title: z.string().min(1, "Titel is verplicht").max(100, "Titel mag maximaal 100 tekens zijn"),
  description: z.string().min(1, "Beschrijving is verplicht"),
  level: z.enum(["REMEMBER", "UNDERSTAND", "APPLY", "ANALYZE", "EVALUATE", "CREATE"]).default("APPLY"),
  category: z.enum(["KNOWLEDGE", "SKILLS", "ATTITUDE"]).default("SKILLS"),
  sortOrder: z.coerce.number().min(0).optional(),
  visionLinks: z.array(z.object({
    visionId: z.string(),
    relevance: z.enum(["PRIMARY", "SECONDARY", "TERTIARY"]).default("PRIMARY"),
  })).optional(),
});

export type LearningOutcomeFormData = z.infer<typeof learningOutcomeSchema>;

export const learningOutcomeUpdateSchema = learningOutcomeSchema.partial().omit({ cohortId: true });

export type LearningOutcomeUpdateData = z.infer<typeof learningOutcomeUpdateSchema>;
