import { z } from "zod";

// HBO Config validation schema
export const hboConfigSchema = z.object({
  programId: z.string().min(1, "Opleiding is verplicht"),
  domein: z.string().max(100, "Domein mag maximaal 100 tekens zijn").optional(),
  variant: z.enum(["VOLTIJD", "DEELTIJD", "DUAAL"]).default("VOLTIJD"),
  toetsfilosofie: z.enum(["PROGRAMMATISCH", "TRADITIONEEL"]).default("TRADITIONEEL"),
  ordeningsprincipe: z.enum(["PROJECTEN", "VRAAGSTUKKEN", "THEMAS"]).default("THEMAS"),
  tijdsnede: z.enum(["JAAR", "SEMESTER", "PERIODE"]).default("SEMESTER"),
});

export type HBOConfigFormData = z.infer<typeof hboConfigSchema>;

export const hboConfigUpdateSchema = hboConfigSchema.partial().omit({ programId: true });

export type HBOConfigUpdateData = z.infer<typeof hboConfigUpdateSchema>;
