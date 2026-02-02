// MBO-specific options and labels

export const MBO_LEERWEG_OPTIONS = [
  { value: "BOL", label: "BOL - Beroepsopleidende Leerweg", description: "School-gestuurd onderwijs met stage" },
  { value: "BBL", label: "BBL - Beroepsbegeleidende Leerweg", description: "Leren en werken gecombineerd" },
] as const;

export const MBO_NIVEAU_OPTIONS = [
  { value: "NIVEAU_1", label: "Niveau 1 - Entree", description: "Basisberoepsgericht onderwijs" },
  { value: "NIVEAU_2", label: "Niveau 2 - Basisberoepsopleiding", description: "Basisberoepspraktijk" },
  { value: "NIVEAU_3", label: "Niveau 3 - Vakopleiding", description: "Zelfstandig vakbekwaam" },
  { value: "NIVEAU_4", label: "Niveau 4 - Middenkaderopleiding", description: "Specialisatie en doorstroom HBO" },
] as const;

export const MBO_ONTWERPPRINCIPE_OPTIONS = [
  { value: "SCHOOL_PRIMAIR", label: "School-primair", description: "Leren vindt voornamelijk op school plaats" },
  { value: "BPV_PRIMAIR", label: "BPV-primair", description: "Leren vindt voornamelijk in de praktijk plaats" },
  { value: "HYBRIDE", label: "Hybride", description: "Evenwichtige mix van school en praktijk" },
] as const;

export const MBO_DURATION_OPTIONS = [
  { value: 1, label: "1 jaar" },
  { value: 2, label: "2 jaar" },
  { value: 3, label: "3 jaar" },
  { value: 4, label: "4 jaar" },
] as const;

// Labels for display
export const MBO_LABELS = {
  leerweg: {
    BOL: "BOL",
    BBL: "BBL",
  },
  niveau: {
    NIVEAU_1: "Niveau 1",
    NIVEAU_2: "Niveau 2",
    NIVEAU_3: "Niveau 3",
    NIVEAU_4: "Niveau 4",
  },
  ontwerpprincipe: {
    SCHOOL_PRIMAIR: "School-primair",
    BPV_PRIMAIR: "BPV-primair",
    HYBRIDE: "Hybride",
  },
} as const;

// Helper function to get label
export function getMBOLabel(type: keyof typeof MBO_LABELS, value: string): string {
  const labels = MBO_LABELS[type] as Record<string, string>;
  return labels[value] || value;
}
