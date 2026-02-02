// HBO-specific options and labels

export const HBO_VARIANT_OPTIONS = [
  { value: "VOLTIJD", label: "Voltijd", description: "Fulltime studie" },
  { value: "DEELTIJD", label: "Deeltijd", description: "Studeren naast werk" },
  { value: "DUAAL", label: "Duaal", description: "Leren en werken gecombineerd" },
] as const;

export const HBO_TOETSFILOSOFIE_OPTIONS = [
  {
    value: "PROGRAMMATISCH",
    label: "Programmatisch toetsen",
    description: "Bewijslast, feedbackmomenten en beslismomenten"
  },
  {
    value: "TRADITIONEEL",
    label: "Traditioneel toetsen",
    description: "Toetsmomenten, weging, herkansing en normering"
  },
] as const;

export const HBO_ORDENINGSPRINCIPE_OPTIONS = [
  { value: "PROJECTEN", label: "Projecten", description: "Curriculum georganiseerd rond projecten" },
  { value: "VRAAGSTUKKEN", label: "Vraagstukken", description: "Curriculum georganiseerd rond beroepsvraagstukken" },
  { value: "THEMAS", label: "Thema's", description: "Curriculum georganiseerd rond thema's" },
] as const;

export const HBO_TIJDSNEDE_OPTIONS = [
  { value: "JAAR", label: "Per jaar", description: "Curriculum opgedeeld in jaren" },
  { value: "SEMESTER", label: "Per semester", description: "Curriculum opgedeeld in semesters" },
  { value: "PERIODE", label: "Per periode", description: "Curriculum opgedeeld in kortere periodes" },
] as const;

export const HBO_DEGREE_OPTIONS = [
  { value: "BACHELOR", label: "Bachelor", description: "4-jarige HBO opleiding" },
  { value: "MASTER", label: "Master", description: "1-2 jarige vervolgopleiding" },
  { value: "ASSOCIATE", label: "Associate Degree", description: "2-jarige HBO opleiding" },
] as const;

// Labels for display
export const HBO_LABELS = {
  variant: {
    VOLTIJD: "Voltijd",
    DEELTIJD: "Deeltijd",
    DUAAL: "Duaal",
  },
  toetsfilosofie: {
    PROGRAMMATISCH: "Programmatisch toetsen",
    TRADITIONEEL: "Traditioneel toetsen",
  },
  ordeningsprincipe: {
    PROJECTEN: "Projecten",
    VRAAGSTUKKEN: "Vraagstukken",
    THEMAS: "Thema's",
  },
  tijdsnede: {
    JAAR: "Per jaar",
    SEMESTER: "Per semester",
    PERIODE: "Per periode",
  },
  degreeType: {
    BACHELOR: "Bachelor",
    MASTER: "Master",
    ASSOCIATE: "Associate Degree",
  },
} as const;

// Helper function to get label
export function getHBOLabel(type: keyof typeof HBO_LABELS, value: string): string {
  const labels = HBO_LABELS[type] as Record<string, string>;
  return labels[value] || value;
}
