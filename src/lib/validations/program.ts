import { z } from "zod";

export const programSchema = z.object({
  academyId: z.string().min(1, "Academie is verplicht"),
  name: z.string().min(1, "Naam is verplicht").max(100, "Naam mag maximaal 100 tekens zijn"),
  code: z.string().min(1, "Code is verplicht").max(10, "Code mag maximaal 10 tekens zijn"),
  crohoCode: z.string().max(10).optional(),
  educationType: z.enum(["MBO", "HBO"]).default("HBO"),
  degreeType: z.enum(["BACHELOR", "MASTER", "ASSOCIATE", "MBO4", "MBO3", "MBO2"]).default("BACHELOR"),
  durationYears: z.coerce.number().min(1).max(6).default(4),
  totalCredits: z.coerce.number().min(1).max(300).default(240),
}).superRefine((data, ctx) => {
  // MBO-specifieke validaties
  if (data.educationType === "MBO") {
    if (data.durationYears < 1 || data.durationYears > 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MBO-opleidingen duren 1 tot 4 jaar",
        path: ["durationYears"],
      });
    }
  }

  // HBO-specifieke validaties
  if (data.educationType === "HBO") {
    if (data.totalCredits % 30 !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "HBO credits moeten een veelvoud van 30 EC zijn",
        path: ["totalCredits"],
      });
    }
  }
});

export type ProgramFormData = z.infer<typeof programSchema>;

export const programUpdateSchema = programSchema.partial().omit({ academyId: true, educationType: true });

export type ProgramUpdateData = z.infer<typeof programUpdateSchema>;
