import type { EducationType } from "@prisma/client";

export type TerminologyKey =
  | "credits"
  | "creditsLabel"
  | "creditsShort"
  | "year"
  | "block"
  | "teachingUnit"
  | "learningOutcome"
  | "learningOutcomePlural"
  | "assessment"
  | "assessmentPlural"
  | "vision"
  | "curriculum"
  | "outcome"
  | "outcomePlural"
  | "program"
  | "cohort";

export type TerminologyMap = Record<TerminologyKey, string>;

const MBO_TERMS: TerminologyMap = {
  credits: "SBU",
  creditsLabel: "Studiebelastingsuren",
  creditsShort: "uur",
  year: "Leerjaar",
  block: "Periode",
  teachingUnit: "Leereenheid",
  learningOutcome: "Werkproces",
  learningOutcomePlural: "Werkprocessen",
  assessment: "Proeve van bekwaamheid",
  assessmentPlural: "Proeven van bekwaamheid",
  vision: "Beroepsbeeld",
  curriculum: "Kwalificatiedossier",
  outcome: "Werkproces",
  outcomePlural: "Werkprocessen",
  program: "Opleiding",
  cohort: "Cohort",
};

const HBO_TERMS: TerminologyMap = {
  credits: "EC",
  creditsLabel: "Studiepunten (ECTS)",
  creditsShort: "EC",
  year: "Studiejaar",
  block: "Blok",
  teachingUnit: "Onderwijseenheid",
  learningOutcome: "Leeruitkomst",
  learningOutcomePlural: "Leeruitkomsten",
  assessment: "Toets",
  assessmentPlural: "Toetsen",
  vision: "Visie",
  curriculum: "Curriculum",
  outcome: "Leeruitkomst",
  outcomePlural: "Leeruitkomsten",
  program: "Opleiding",
  cohort: "Cohort",
};

export function getTerminology(educationType: EducationType): TerminologyMap {
  return educationType === "MBO" ? MBO_TERMS : HBO_TERMS;
}

export function getTerm(educationType: EducationType, key: TerminologyKey): string {
  const terms = getTerminology(educationType);
  return terms[key];
}

// Helper to format credits with correct unit
export function formatCredits(educationType: EducationType, amount: number): string {
  const unit = educationType === "MBO" ? "SBU" : "EC";
  return `${amount} ${unit}`;
}
