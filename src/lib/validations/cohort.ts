import { z } from "zod";

export const cohortSchema = z.object({
  programId: z.string().min(1, "Opleiding is verplicht"),
  name: z.string().min(1, "Naam is verplicht").max(50, "Naam mag maximaal 50 tekens zijn"),
  startYear: z.coerce.number().min(2000).max(2100),
  endYear: z.coerce.number().min(2000).max(2100),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  isActive: z.coerce.boolean().default(false),
}).refine((data) => data.endYear > data.startYear, {
  message: "Eindjaar moet na startjaar liggen",
  path: ["endYear"],
});

export type CohortFormData = z.infer<typeof cohortSchema>;

export const cohortUpdateSchema = cohortSchema.partial().omit({ programId: true });

export type CohortUpdateData = z.infer<typeof cohortUpdateSchema>;
