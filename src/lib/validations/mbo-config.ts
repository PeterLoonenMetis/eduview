import { z } from "zod";

// MBO Config validation schema
export const mboConfigSchema = z.object({
  programId: z.string().min(1, "Opleiding is verplicht"),
  leerweg: z.enum(["BOL", "BBL"]).default("BOL"),
  niveau: z.enum(["NIVEAU_1", "NIVEAU_2", "NIVEAU_3", "NIVEAU_4"]).default("NIVEAU_4"),
  ontwerpprincipe: z.enum(["SCHOOL_PRIMAIR", "BPV_PRIMAIR", "HYBRIDE"]).default("HYBRIDE"),
  kdNaam: z.string().max(200, "Naam mag maximaal 200 tekens zijn").optional(),
  kdVersie: z.string().max(50, "Versie mag maximaal 50 tekens zijn").optional(),
  kdPeildatum: z.coerce.date().optional(),
});

export type MBOConfigFormData = z.infer<typeof mboConfigSchema>;

export const mboConfigUpdateSchema = mboConfigSchema.partial().omit({ programId: true });

export type MBOConfigUpdateData = z.infer<typeof mboConfigUpdateSchema>;

// Kerntaak validation schema
export const kerntaakSchema = z.object({
  mboConfigId: z.string().min(1, "MBO configuratie is verplicht"),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  naam: z.string().min(1, "Naam is verplicht").max(200, "Naam mag maximaal 200 tekens zijn"),
  beschrijving: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type KerntaakFormData = z.infer<typeof kerntaakSchema>;

export const kerntaakUpdateSchema = kerntaakSchema.partial().omit({ mboConfigId: true });

export type KerntaakUpdateData = z.infer<typeof kerntaakUpdateSchema>;

// Werkproces validation schema
export const werkprocesSchema = z.object({
  kerntaakId: z.string().min(1, "Kerntaak is verplicht"),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  naam: z.string().min(1, "Naam is verplicht").max(200, "Naam mag maximaal 200 tekens zijn"),
  beschrijving: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type WerkprocesFormData = z.infer<typeof werkprocesSchema>;

export const werkprocesUpdateSchema = werkprocesSchema.partial().omit({ kerntaakId: true });

export type WerkprocesUpdateData = z.infer<typeof werkprocesUpdateSchema>;

// Keuzedeel validation schema
export const keuzedeelSchema = z.object({
  mboConfigId: z.string().min(1, "MBO configuratie is verplicht"),
  code: z.string().min(1, "Code is verplicht").max(20, "Code mag maximaal 20 tekens zijn"),
  naam: z.string().min(1, "Naam is verplicht").max(200, "Naam mag maximaal 200 tekens zijn"),
  studiepunten: z.coerce.number().min(0, "Studiepunten moeten 0 of meer zijn").default(0),
  beschrijving: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type KeuzedeelFormData = z.infer<typeof keuzedeelSchema>;

export const keuzedeelUpdateSchema = keuzedeelSchema.partial().omit({ mboConfigId: true });

export type KeuzedeelUpdateData = z.infer<typeof keuzedeelUpdateSchema>;
