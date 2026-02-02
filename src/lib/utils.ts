import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to Dutch locale
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format date to short Dutch format
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Calculate SBU (Studielasturen) from EC
export function ecToSbu(ec: number): number {
  return ec * 28;
}

// Calculate EC from SBU
export function sbuToEc(sbu: number): number {
  return Math.round((sbu / 28) * 10) / 10;
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

// Generate a slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Block type colors
export const blockTypeColors = {
  EDUCATIONAL: {
    bg: "bg-primary-500",
    text: "text-white",
    border: "border-primary-500",
    light: "bg-primary-50",
  },
  PROJECT: {
    bg: "bg-secondary-500",
    text: "text-white",
    border: "border-secondary-500",
    light: "bg-secondary-50",
  },
  PRACTICAL: {
    bg: "bg-accent-500",
    text: "text-white",
    border: "border-accent-500",
    light: "bg-accent-50",
  },
  INTERNSHIP: {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-500",
    light: "bg-gray-50",
  },
  GRADUATION: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-500",
    light: "bg-purple-50",
  },
} as const;

// Status colors
export const statusColors = {
  DRAFT: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
  },
  IN_REVIEW: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  ARCHIVED: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-400",
  },
} as const;

// Dutch labels for enums
export const enumLabels = {
  // Block types
  EDUCATIONAL: "Onderwijsblok",
  PROJECT: "Project",
  PRACTICAL: "Praktijkvraagstuk",
  INTERNSHIP: "Stage",
  GRADUATION: "Afstuderen",

  // Content status
  DRAFT: "Concept",
  IN_REVIEW: "In review",
  APPROVED: "Vastgesteld",
  ARCHIVED: "Gearchiveerd",

  // Vision types
  LEARNING: "Visie op Leren en Onderwijs",
  PROFESSION: "Visie op het Beroep",
  ASSESSMENT: "Visie op Toetsing en Examinering",

  // Bloom levels
  REMEMBER: "Onthouden",
  UNDERSTAND: "Begrijpen",
  APPLY: "Toepassen",
  ANALYZE: "Analyseren",
  EVALUATE: "Evalueren",
  CREATE: "Creëren",

  // Assessment forms
  WRITTEN_EXAM_OPEN: "Schriftelijk tentamen (open)",
  WRITTEN_EXAM_CLOSED: "Schriftelijk tentamen (gesloten)",
  WRITTEN_EXAM_MIXED: "Schriftelijk tentamen (gemengd)",
  ORAL_EXAM: "Mondeling tentamen",
  PORTFOLIO: "Portfolio",
  PRESENTATION: "Presentatie",
  PRODUCT: "Product/artefact",
  PRACTICAL_ASSESSMENT: "Praktijkbeoordeling",
  REPORT: "Verslag/paper",
  CASE_STUDY: "Casustoets",
  SKILL_TEST: "Vaardigheidstoets",
  PEER_ASSESSMENT: "Peer assessment",
  SELF_ASSESSMENT: "Zelfbeoordeling",

  // Assessment types
  FORMATIVE: "Formatief",
  SUMMATIVE: "Summatief",

  // Grading models
  NUMERIC: "Cijfer (1-10)",
  PASS_FAIL: "Voldaan/Niet voldaan",
  RUBRIC: "Rubric",
  LETTER: "Letter (A-F)",

  // User roles
  ADMIN: "Beheerder",
  MANAGER: "Manager",
  DEVELOPER: "Onderwijsontwikkelaar",
  TEACHER: "Docent",
  STUDENT: "Student",
  REVIEWER: "Reviewer",

  // Activity types
  LECTURE: "Hoorcollege",
  SEMINAR: "Werkcollege",
  WORKSHOP: "Workshop",
  SELF_STUDY: "Zelfstudie",
  GROUP_WORK: "Groepswerk",
  PRACTICAL_ACTIVITY: "Practicum",
  EXCURSION: "Excursie",
  GUEST_LECTURE: "Gastcollege",
  COACHING: "Coaching",

  // Degree types
  BACHELOR: "Bachelor",
  MASTER: "Master",
  ASSOCIATE: "Associate Degree",
  MBO4: "MBO Niveau 4",
  MBO3: "MBO Niveau 3",
  MBO2: "MBO Niveau 2",
} as const;

// Get label for any enum value
export function getLabel(value: string): string {
  return enumLabels[value as keyof typeof enumLabels] || value;
}
