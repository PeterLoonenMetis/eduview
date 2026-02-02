"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { createCohort, updateCohort } from "@/app/actions/cohorts";
import type { Cohort, Program } from "@prisma/client";

interface CohortFormProps {
  cohort?: Cohort;
  programs: Program[];
  defaultProgramId?: string;
}

const statusOptions = [
  { value: "DRAFT", label: "Concept" },
  { value: "ACTIVE", label: "Actief" },
  { value: "ARCHIVED", label: "Gearchiveerd" },
];

export function CohortForm({ cohort, programs, defaultProgramId }: CohortFormProps) {
  const isEditing = !!cohort;
  const action = isEditing
    ? updateCohort.bind(null, cohort.id)
    : createCohort;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  });

  const programOptions = programs.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.code})`,
  }));

  const currentYear = new Date().getFullYear();

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <Alert variant="error" title="Fout">
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert variant="success" title="Succes">
          Cohort is {isEditing ? "bijgewerkt" : "aangemaakt"}.
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {!isEditing && (
          <Select
            name="programId"
            label="Opleiding"
            options={programOptions}
            defaultValue={defaultProgramId || programs[0]?.id}
            required
            error={state.errors?.programId?.[0]}
          />
        )}

        <Input
          name="name"
          label="Naam cohort"
          placeholder="bijv. Cohort 2024-2028"
          defaultValue={cohort?.name}
          required
          error={state.errors?.name?.[0]}
        />

        <Input
          name="startYear"
          label="Startjaar"
          type="number"
          min={2020}
          max={2050}
          defaultValue={cohort?.startYear || currentYear}
          required
          error={state.errors?.startYear?.[0]}
        />

        <Input
          name="endYear"
          label="Eindjaar"
          type="number"
          min={2020}
          max={2060}
          defaultValue={cohort?.endYear || currentYear + 4}
          required
          error={state.errors?.endYear?.[0]}
        />

        <Select
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue={cohort?.status || "DRAFT"}
          error={state.errors?.status?.[0]}
        />

        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            value="true"
            defaultChecked={cohort?.isActive || false}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Dit is het actieve cohort
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Bezig..." : isEditing ? "Opslaan" : "Aanmaken"}
        </Button>
      </div>
    </form>
  );
}
