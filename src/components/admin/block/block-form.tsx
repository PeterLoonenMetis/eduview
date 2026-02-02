"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { createBlock, updateBlock } from "@/app/actions/blocks";
import type { Block, AcademicYear } from "@prisma/client";

interface BlockFormProps {
  block?: Block;
  academicYears: AcademicYear[];
  defaultAcademicYearId?: string;
}

const typeOptions = [
  { value: "EDUCATIONAL", label: "Onderwijsblok" },
  { value: "INTERNSHIP", label: "Stage" },
  { value: "GRADUATION", label: "Afstuderen" },
  { value: "ELECTIVE", label: "Keuzevak" },
];

const statusOptions = [
  { value: "DRAFT", label: "Concept" },
  { value: "REVIEW", label: "In review" },
  { value: "APPROVED", label: "Goedgekeurd" },
];

export function BlockForm({ block, academicYears, defaultAcademicYearId }: BlockFormProps) {
  const isEditing = !!block;
  const action = isEditing
    ? updateBlock.bind(null, block.id)
    : createBlock;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  });

  const yearOptions = academicYears.map((y) => ({
    value: y.id,
    label: `Jaar ${y.yearNumber}: ${y.name}`,
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
          Blok is {isEditing ? "bijgewerkt" : "aangemaakt"}.
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {!isEditing && (
          <Select
            name="academicYearId"
            label="Academisch jaar"
            options={yearOptions}
            defaultValue={defaultAcademicYearId || academicYears[0]?.id}
            required
            error={state.errors?.academicYearId?.[0]}
          />
        )}

        <Input
          name="code"
          label="Code"
          placeholder="bijv. BL1.1"
          defaultValue={block?.code}
          required
          maxLength={20}
          error={state.errors?.code?.[0]}
        />

        <div className={isEditing ? "" : "md:col-span-2"}>
          <Input
            name="name"
            label="Naam"
            placeholder="bijv. Oriëntatie op ICT"
            defaultValue={block?.name}
            required
            error={state.errors?.name?.[0]}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            name="shortDescription"
            label="Korte beschrijving"
            placeholder="Een korte samenvatting van het blok..."
            defaultValue={block?.shortDescription}
            required
            rows={2}
            error={state.errors?.shortDescription?.[0]}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            name="longDescription"
            label="Uitgebreide beschrijving"
            placeholder="Gedetailleerde beschrijving van het blok..."
            defaultValue={block?.longDescription || ""}
            rows={4}
            error={state.errors?.longDescription?.[0]}
          />
        </div>

        <Select
          name="type"
          label="Type"
          options={typeOptions}
          defaultValue={block?.type || "EDUCATIONAL"}
          error={state.errors?.type?.[0]}
        />

        <Select
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue={block?.status || "DRAFT"}
          error={state.errors?.status?.[0]}
        />

        <Input
          name="credits"
          label="Studiepunten (EC)"
          type="number"
          min={1}
          max={60}
          defaultValue={block?.credits || 15}
          required
          error={state.errors?.credits?.[0]}
        />

        <Input
          name="durationWeeks"
          label="Duur (weken)"
          type="number"
          min={1}
          max={52}
          defaultValue={block?.durationWeeks || 10}
          error={state.errors?.durationWeeks?.[0]}
        />

        <Input
          name="color"
          label="Kleur"
          type="color"
          defaultValue={block?.color || "#164B44"}
          error={state.errors?.color?.[0]}
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
