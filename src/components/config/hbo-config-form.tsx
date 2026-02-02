"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createHBOConfig, updateHBOConfig } from "@/app/actions/hbo-config";
import {
  HBO_VARIANT_OPTIONS,
  HBO_TOETSFILOSOFIE_OPTIONS,
  HBO_ORDENINGSPRINCIPE_OPTIONS,
  HBO_TIJDSNEDE_OPTIONS,
} from "@/lib/education-types/hbo";
import type { HBOConfig } from "@prisma/client";

interface HBOConfigFormProps {
  programId: string;
  config?: HBOConfig;
  onSuccess?: () => void;
}

export function HBOConfigForm({ programId, config, onSuccess }: HBOConfigFormProps) {
  const isEditing = !!config;
  const action = isEditing
    ? updateHBOConfig.bind(null, programId)
    : createHBOConfig;

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
          HBO-configuratie is {isEditing ? "bijgewerkt" : "aangemaakt"}.
        </Alert>
      )}

      {/* Domein */}
      <Card>
        <CardHeader>
          <CardTitle>Domein</CardTitle>
          <CardDescription>
            Optioneel: specificeer het werkveld of domein van de opleiding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            name="domein"
            label="Domein (optioneel)"
            placeholder="bijv. Techniek, Zorg, Economie"
            defaultValue={config?.domein || ""}
            error={state.errors?.domein?.[0]}
          />
        </CardContent>
      </Card>

      {/* Variant */}
      <Card>
        <CardHeader>
          <CardTitle>Opleidingsvariant</CardTitle>
          <CardDescription>
            Kies de variant die bepaalt hoe het onderwijs wordt aangeboden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="variant"
            label="Variant"
            options={HBO_VARIANT_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            defaultValue={config?.variant || "VOLTIJD"}
            required
            error={state.errors?.variant?.[0]}
          />
        </CardContent>
      </Card>

      {/* Toetsfilosofie */}
      <Card>
        <CardHeader>
          <CardTitle>Toetsfilosofie</CardTitle>
          <CardDescription>
            Bepaalt hoe toetsing wordt ingericht en welke termen worden gebruikt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              name="toetsfilosofie"
              label="Toetsfilosofie"
              options={HBO_TOETSFILOSOFIE_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              defaultValue={config?.toetsfilosofie || "TRADITIONEEL"}
              required
              error={state.errors?.toetsfilosofie?.[0]}
            />
            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Wat betekent dit?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <strong>Programmatisch:</strong> Werken met bewijslast, feedbackmomenten en
                  beslismomenten
                </li>
                <li>
                  <strong>Traditioneel:</strong> Werken met toetsmomenten, weging, herkansing en
                  normering
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ordeningsprincipe */}
      <Card>
        <CardHeader>
          <CardTitle>Ordeningsprincipe curriculum</CardTitle>
          <CardDescription>
            Bepaalt de hoofdstructuur van het curriculum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="ordeningsprincipe"
            label="Ordeningsprincipe"
            options={HBO_ORDENINGSPRINCIPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            defaultValue={config?.ordeningsprincipe || "THEMAS"}
            required
            error={state.errors?.ordeningsprincipe?.[0]}
          />
        </CardContent>
      </Card>

      {/* Tijdsnede */}
      <Card>
        <CardHeader>
          <CardTitle>Tijdsnede</CardTitle>
          <CardDescription>
            Bepaalt hoe het curriculum wordt opgedeeld in tijd
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="tijdsnede"
            label="Tijdsnede"
            options={HBO_TIJDSNEDE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            defaultValue={config?.tijdsnede || "SEMESTER"}
            required
            error={state.errors?.tijdsnede?.[0]}
          />
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
