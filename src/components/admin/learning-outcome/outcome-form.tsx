"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { createLearningOutcome, updateLearningOutcome } from "@/app/actions/learning-outcomes";
import type { LearningOutcome, Cohort, Vision } from "@prisma/client";

interface OutcomeFormProps {
  outcome?: LearningOutcome;
  cohorts: Cohort[];
  visions?: Vision[];
  defaultCohortId?: string;
}

const levelOptions = [
  { value: "REMEMBER", label: "Onthouden" },
  { value: "UNDERSTAND", label: "Begrijpen" },
  { value: "APPLY", label: "Toepassen" },
  { value: "ANALYZE", label: "Analyseren" },
  { value: "EVALUATE", label: "Evalueren" },
  { value: "CREATE", label: "Creëren" },
];

const categoryOptions = [
  { value: "KNOWLEDGE", label: "Kennis" },
  { value: "SKILLS", label: "Vaardigheden" },
  { value: "ATTITUDE", label: "Houding" },
];

export function OutcomeForm({ outcome, cohorts, defaultCohortId }: OutcomeFormProps) {
  const isEditing = !!outcome;
  const action = isEditing
    ? updateLearningOutcome.bind(null, outcome.id)
    : createLearningOutcome;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  });

  const cohortOptions = cohorts.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <Alert variant="error" title="Fout">
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert variant="success" title="Succes">
          Leeruitkomst is {isEditing ? "bijgewerkt" : "aangemaakt"}.
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {!isEditing && (
          <Select
            name="cohortId"
            label="Cohort"
            options={cohortOptions}
            defaultValue={defaultCohortId || cohorts[0]?.id}
            required
            error={state.errors?.cohortId?.[0]}
          />
        )}

        <Input
          name="code"
          label="Code"
          placeholder="bijv. LU01"
          defaultValue={outcome?.code}
          required
          maxLength={20}
          error={state.errors?.code?.[0]}
        />

        <div className="md:col-span-2">
          <Input
            name="title"
            label="Titel"
            placeholder="bijv. Probleemanalyse"
            defaultValue={outcome?.title}
            required
            error={state.errors?.title?.[0]}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            name="description"
            label="Beschrijving"
            placeholder="Beschrijf de leeruitkomst in detail..."
            defaultValue={outcome?.description}
            required
            rows={4}
            error={state.errors?.description?.[0]}
          />
        </div>

        <Select
          name="level"
          label="Bloom niveau"
          options={levelOptions}
          defaultValue={outcome?.level || "APPLY"}
          error={state.errors?.level?.[0]}
        />

        <Select
          name="category"
          label="Categorie"
          options={categoryOptions}
          defaultValue={outcome?.category || "SKILLS"}
          error={state.errors?.category?.[0]}
        />
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
