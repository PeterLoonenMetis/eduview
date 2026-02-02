import { z } from "zod";

export const assessmentSchema = z.object({
  blockId: z.string().min(1, "Blok is verplicht"),
  teachingUnitId: z.string().optional(),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  title: z.string().min(1, "Titel is verplicht").max(100, "Titel mag maximaal 100 tekens zijn"),
  description: z.string().optional(),
  assessmentType: z.enum(["FORMATIVE", "SUMMATIVE"]).default("SUMMATIVE"),
  assessmentForm: z.enum([
    "WRITTEN_EXAM_OPEN",
    "WRITTEN_EXAM_CLOSED",
    "WRITTEN_EXAM_MIXED",
    "ORAL_EXAM",
    "PORTFOLIO",
    "PRESENTATION",
    "PRODUCT",
    "PRACTICAL_ASSESSMENT",
    "REPORT",
    "CASE_STUDY",
    "SKILL_TEST",
    "PEER_ASSESSMENT",
    "SELF_ASSESSMENT",
  ]),
  isSummative: z.coerce.boolean().default(true),
  weight: z.coerce.number().min(0).max(100).default(100),
  credits: z.coerce.number().min(0).max(60),
  minimumGrade: z.coerce.number().min(1).max(10).default(5.5),
  retakeAllowed: z.coerce.number().min(0).max(5).default(2),
  gradingModel: z.enum(["NUMERIC", "PASS_FAIL", "RUBRIC", "LETTER"]).default("NUMERIC"),
  durationMinutes: z.coerce.number().min(0).optional(),
  sortOrder: z.coerce.number().min(0).optional(),
  outcomeIds: z.array(z.string()).optional(),
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;

export const assessmentUpdateSchema = assessmentSchema.partial().omit({ blockId: true });

export type AssessmentUpdateData = z.infer<typeof assessmentUpdateSchema>;

// Criterion schema
export const criterionSchema = z.object({
  assessmentId: z.string().min(1, "Toets is verplicht"),
  outcomeId: z.string().optional(),
  name: z.string().min(1, "Naam is verplicht").max(100),
  description: z.string().min(1, "Beschrijving is verplicht"),
  weight: z.coerce.number().min(0).max(100).default(100),
  sortOrder: z.coerce.number().min(0).optional(),
});

export type CriterionFormData = z.infer<typeof criterionSchema>;

// Rubric level schema
export const rubricLevelSchema = z.object({
  criterionId: z.string().min(1, "Criterium is verplicht"),
  level: z.coerce.number().min(1).max(10),
  label: z.string().min(1, "Label is verplicht").max(50),
  description: z.string().min(1, "Beschrijving is verplicht"),
  points: z.coerce.number().min(0),
});

export type RubricLevelFormData = z.infer<typeof rubricLevelSchema>;
