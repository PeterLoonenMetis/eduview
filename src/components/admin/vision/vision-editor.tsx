"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { updateVision } from "@/app/actions/visions";
import type { Vision, VisionPrinciple } from "@prisma/client";

interface VisionEditorProps {
  vision: Vision & { principles: VisionPrinciple[] };
}

const statusOptions = [
  { value: "DRAFT", label: "Concept" },
  { value: "REVIEW", label: "In review" },
  { value: "APPROVED", label: "Goedgekeurd" },
];

const visionTypeLabels = {
  LEARNING: "Visie op Leren en Onderwijs",
  PROFESSION: "Visie op het Beroep",
  ASSESSMENT: "Visie op Toetsing en Examinering",
};

export function VisionEditor({ vision }: VisionEditorProps) {
  const action = updateVision.bind(null, vision.id);
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  });

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <Alert variant="error" title="Fout">
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert variant="success" title="Succes">
          Visie is bijgewerkt.
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {visionTypeLabels[vision.type]}
          </h2>
          <Select
            name="status"
            label=""
            options={statusOptions}
            defaultValue={vision.status}
            className="w-40"
          />
        </div>

        <Input
          name="title"
          label="Titel"
          defaultValue={vision.title}
          placeholder="Geef de visie een titel"
        />

        <Textarea
          name="content"
          label="Visietekst"
          defaultValue={vision.content || ""}
          placeholder="Beschrijf de visie..."
          rows={8}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Opslaan..." : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}
