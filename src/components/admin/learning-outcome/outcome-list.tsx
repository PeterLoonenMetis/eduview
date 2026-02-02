"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteLearningOutcome } from "@/app/actions/learning-outcomes";
import type { LearningOutcome, Vision, OutcomeVisionLink } from "@prisma/client";
import { Edit, Trash2, BookOpen, Briefcase, ClipboardCheck, GripVertical } from "lucide-react";

type OutcomeWithRelations = LearningOutcome & {
  visionLinks: (OutcomeVisionLink & { vision: Vision })[];
  _count: {
    assessmentOutcomes: number;
    assignmentOutcomes: number;
  };
};

interface OutcomeListProps {
  outcomes: OutcomeWithRelations[];
}

const levelLabels = {
  REMEMBER: "Onthouden",
  UNDERSTAND: "Begrijpen",
  APPLY: "Toepassen",
  ANALYZE: "Analyseren",
  EVALUATE: "Evalueren",
  CREATE: "Creëren",
};

const categoryLabels = {
  KNOWLEDGE: "Kennis",
  SKILLS: "Vaardigheden",
  ATTITUDE: "Houding",
};

const visionIcons = {
  LEARNING: BookOpen,
  PROFESSION: Briefcase,
  ASSESSMENT: ClipboardCheck,
};

export function OutcomeList({ outcomes }: OutcomeListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Weet je zeker dat je leeruitkomst "${code}" wilt verwijderen?`)) {
      return;
    }
    startTransition(async () => {
      await deleteLearningOutcome(id);
    });
  };

  if (outcomes.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border-2 border-dashed">
        <h3 className="text-lg font-medium text-gray-900">Geen leeruitkomsten</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Maak een nieuwe leeruitkomst aan om te beginnen.
        </p>
        <Link href="/demo/beheer/leeruitkomsten/nieuw" className="mt-4 inline-block">
          <Button>Nieuwe leeruitkomst</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {outcomes.map((outcome) => (
        <div
          key={outcome.id}
          className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 cursor-grab flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-semibold text-teal-700">
                  {outcome.code}
                </span>
                <h3 className="font-medium truncate">{outcome.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {outcome.description}
              </p>

              <div className="flex items-center gap-4 text-xs">
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {levelLabels[outcome.level]}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {categoryLabels[outcome.category]}
                </span>

                {outcome.visionLinks.length > 0 && (
                  <div className="flex items-center gap-1">
                    {outcome.visionLinks.map((link) => {
                      const Icon = visionIcons[link.vision.type];
                      return (
                        <span key={link.id} title={link.vision.title}>
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </span>
                      );
                    })}
                  </div>
                )}

                <span className="text-muted-foreground">
                  {outcome._count.assessmentOutcomes} toetsen | {outcome._count.assignmentOutcomes} opdrachten
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Link href={`/demo/beheer/leeruitkomsten/${outcome.id}`}>
                <Button variant="ghost" size="icon" title="Bewerken">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(outcome.id, outcome.code)}
                disabled={isPending}
                title="Verwijderen"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
