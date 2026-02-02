import { z } from "zod";

export const visionSchema = z.object({
  title: z.string().min(1, "Titel is verplicht").max(100, "Titel mag maximaal 100 tekens zijn"),
  content: z.string().min(1, "Inhoud is verplicht"),
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "ARCHIVED"]).default("DRAFT"),
});

export type VisionFormData = z.infer<typeof visionSchema>;

export const principleSchema = z.object({
  visionId: z.string().min(1, "Visie is verplicht"),
  title: z.string().min(1, "Titel is verplicht").max(100, "Titel mag maximaal 100 tekens zijn"),
  description: z.string().min(1, "Beschrijving is verplicht"),
  sortOrder: z.coerce.number().min(0).optional(),
});

export type PrincipleFormData = z.infer<typeof principleSchema>;

export const principleUpdateSchema = principleSchema.partial().omit({ visionId: true });

export type PrincipleUpdateData = z.infer<typeof principleUpdateSchema>;
