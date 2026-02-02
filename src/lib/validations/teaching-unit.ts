import { z } from "zod";

export const teachingUnitSchema = z.object({
  blockId: z.string().min(1, "Blok is verplicht"),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  name: z.string().min(1, "Naam is verplicht").max(100, "Naam mag maximaal 100 tekens zijn"),
  description: z.string().optional(),
  credits: z.coerce.number().min(0).max(60),
  contactHours: z.coerce.number().min(0).default(0),
  selfStudyHours: z.coerce.number().min(0).default(0),
  sortOrder: z.coerce.number().min(0).optional(),
});

export type TeachingUnitFormData = z.infer<typeof teachingUnitSchema>;

export const teachingUnitUpdateSchema = teachingUnitSchema.partial().omit({ blockId: true });

export type TeachingUnitUpdateData = z.infer<typeof teachingUnitUpdateSchema>;

// Week Planning schema
export const weekPlanningSchema = z.object({
  teachingUnitId: z.string().min(1, "Onderwijseenheid is verplicht"),
  weekNumber: z.coerce.number().min(1).max(52),
  theme: z.string().min(1, "Thema is verplicht").max(100),
  learningGoals: z.string().optional(),
});

export type WeekPlanningFormData = z.infer<typeof weekPlanningSchema>;

// Learning Activity schema
export const activitySchema = z.object({
  weekPlanningId: z.string().min(1, "Weekplanning is verplicht"),
  name: z.string().min(1, "Naam is verplicht").max(100),
  description: z.string().optional(),
  activityType: z.enum([
    "LECTURE",
    "SEMINAR",
    "WORKSHOP",
    "SELF_STUDY",
    "GROUP_WORK",
    "PRACTICAL",
    "EXCURSION",
    "GUEST_LECTURE",
    "COACHING",
  ]).default("LECTURE"),
  durationMinutes: z.coerce.number().min(0).default(90),
  materials: z.string().optional(),
  sortOrder: z.coerce.number().min(0).optional(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;

// Assignment schema
export const assignmentSchema = z.object({
  teachingUnitId: z.string().min(1, "Onderwijseenheid is verplicht"),
  weekPlanningId: z.string().optional(),
  code: z.string().min(1, "Code is verplicht").max(20),
  title: z.string().min(1, "Titel is verplicht").max(100),
  description: z.string().min(1, "Beschrijving is verplicht"),
  assignmentType: z.enum(["KNOWLEDGE", "SKILL", "REFLECTION", "RESEARCH", "PRODUCTION"]).default("SKILL"),
  workForm: z.enum(["INDIVIDUAL", "PAIRS", "SMALL_GROUP", "LARGE_GROUP", "CLASS_WIDE"]).default("INDIVIDUAL"),
  isGroup: z.coerce.boolean().default(false),
  groupSizeMin: z.coerce.number().min(1).optional(),
  groupSizeMax: z.coerce.number().min(1).optional(),
  estimatedHours: z.coerce.number().min(0).optional(),
  dueWeek: z.coerce.number().min(1).optional(),
  sortOrder: z.coerce.number().min(0).optional(),
  outcomeIds: z.array(z.string()).optional(),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;

export const assignmentUpdateSchema = assignmentSchema.partial().omit({ teachingUnitId: true });

export type AssignmentUpdateData = z.infer<typeof assignmentUpdateSchema>;
