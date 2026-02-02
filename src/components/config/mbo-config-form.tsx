"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createMBOConfig, updateMBOConfig } from "@/app/actions/mbo-config";
import {
  MBO_LEERWEG_OPTIONS,
  MBO_NIVEAU_OPTIONS,
  MBO_ONTWERPPRINCIPE_OPTIONS,
} from "@/lib/education-types/mbo";
import type { MBOConfig, Kerntaak, Werkproces, Keuzedeel } from "@prisma/client";

type MBOConfigWithRelations = MBOConfig & {
  kerntaken: (Kerntaak & { werkprocessen: Werkproces[] })[];
  keuzedelen: Keuzedeel[];
};

interface MBOConfigFormProps {
  programId: string;
  config?: MBOConfigWithRelations;
  onSuccess?: () => void;
}

export function MBOConfigForm({ programId, config, onSuccess }: MBOConfigFormProps) {
  const isEditing = !!config;
  const action = isEditing
    ? updateMBOConfig.bind(null, programId)
    : createMBOConfig;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  });

  // Call onSuccess when successful
  if (state.success && onSuccess) {
    onSuccess();
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="programId" value={programId} />

      {state.error && (
        <Alert variant="error" title="Fout">
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert variant="success" title="Succes">
          MBO-configuratie is {isEditing ? "bijgewerkt" : "aangemaakt"}.
        </Alert>
      )}

      {/* Leerweg */}
      <Card>
        <CardHeader>
          <CardTitle>Leerweg</CardTitle>
          <CardDescription>
            Kies de leerweg die bepaalt hoe het onderwijs wordt aangeboden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="leerweg"
            label="Leerweg"
            options={MBO_LEERWEG_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            defaultValue={config?.leerweg || "BOL"}
            required
            error={state.errors?.leerweg?.[0]}
          />
          <div className="mt-3 text-sm text-muted-foreground bg-muted p-4 rounded-lg">
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>BOL:</strong> {MBO_LEERWEG_OPTIONS[0].description}
              </li>
              <li>
                <strong>BBL:</strong> {MBO_LEERWEG_OPTIONS[1].description}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Niveau */}
      <Card>
        <CardHeader>
          <CardTitle>Niveau</CardTitle>
          <CardDescription>
            Het MBO-niveau bepaalt de complexiteit en duur van de opleiding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="niveau"
            label="MBO Niveau"
            options={MBO_NIVEAU_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            defaultValue={config?.niveau || "NIVEAU_4"}
            required
            error={state.errors?.niveau?.[0]}
          />
        </CardContent>
      </Card>

      {/* Ontwerpprincipe */}
      <Card>
        <CardHeader>
          <CardTitle>Ontwerpprincipe leeromgeving</CardTitle>
          <CardDescription>
            Bepaalt de balans tussen schoolleren en praktijkleren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="ontwerpprincipe"
            label="Ontwerpprincipe"
            options={MBO_ONTWERPPRINCIPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            defaultValue={config?.ontwerpprincipe || "HYBRIDE"}
            required
            error={state.errors?.ontwerpprincipe?.[0]}
          />
        </CardContent>
      </Card>

      {/* Kwalificatiedossier */}
      <Card>
        <CardHeader>
          <CardTitle>Kwalificatiedossier</CardTitle>
          <CardDescription>
            Informatie over het kwalificatiedossier waarop de opleiding is gebaseerd
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              name="kdNaam"
              label="Naam kwalificatiedossier"
              placeholder="bijv. ICT- en Mediabeheer"
              defaultValue={config?.kdNaam || ""}
              error={state.errors?.kdNaam?.[0]}
            />
            <Input
              name="kdVersie"
              label="Versie"
              placeholder="bijv. 2024"
              defaultValue={config?.kdVersie || ""}
              error={state.errors?.kdVersie?.[0]}
            />
            <Input
              name="kdPeildatum"
              label="Peildatum"
              type="date"
              defaultValue={
                config?.kdPeildatum
                  ? new Date(config.kdPeildatum).toISOString().split("T")[0]
                  : ""
              }
              error={state.errors?.kdPeildatum?.[0]}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Na het aanmaken van de configuratie kun je kerntaken en werkprocessen toevoegen.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Bezig..." : isEditing ? "Opslaan" : "Configuratie opslaan"}
        </Button>
      </div>
    </form>
  );
}
