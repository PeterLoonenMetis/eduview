"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteCohort, initializeCohort } from "@/app/actions/cohorts";
import type { Cohort, Program } from "@prisma/client";
import { Edit, Trash2, Play, CheckCircle, Archive, FileText } from "lucide-react";

type CohortWithRelations = Cohort & {
  program: Program;
  _count: {
    visions: number;
    learningOutcomes: number;
    academicYears: number;
  };
};

interface CohortListProps {
  cohorts: CohortWithRelations[];
}

const statusConfig: Record<string, { label: string; icon: typeof FileText; className: string }> = {
  DRAFT: { label: "Concept", icon: FileText, className: "text-yellow-600 bg-yellow-50" },
  ACTIVE: { label: "Actief", icon: CheckCircle, className: "text-green-600 bg-green-50" },
  ARCHIVED: { label: "Gearchiveerd", icon: Archive, className: "text-gray-600 bg-gray-50" },
  COMPLETED: { label: "Afgerond", icon: CheckCircle, className: "text-blue-600 bg-blue-50" },
};

export function CohortList({ cohorts }: CohortListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Weet je zeker dat je cohort "${name}" wilt verwijderen?`)) {
      return;
    }
    startTransition(async () => {
      await deleteCohort(id);
    });
  };

  const handleInitialize = (id: string) => {
    startTransition(async () => {
      await initializeCohort(id);
    });
  };

  if (cohorts.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border-2 border-dashed">
        <h3 className="text-lg font-medium text-gray-900">Geen cohorten</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Maak een nieuw cohort aan om te beginnen.
        </p>
        <Link href="/demo/beheer/cohorten/nieuw" className="mt-4 inline-block">
          <Button>Nieuw cohort</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium">Naam</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Opleiding</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Periode</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Structuur</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {cohorts.map((cohort) => {
            const status = statusConfig[cohort.status];
            const StatusIcon = status.icon;
            const hasStructure = cohort._count.academicYears > 0;

            return (
              <tr key={cohort.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cohort.name}</span>
                    {cohort.isActive && (
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        Actief
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {cohort.program.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  {cohort.startYear} - {cohort.endYear}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {hasStructure ? (
                    <span>
                      {cohort._count.academicYears} jaren, {cohort._count.visions} visies, {cohort._count.learningOutcomes} LU
                    </span>
                  ) : (
                    <span className="text-yellow-600">Niet geinitialiseerd</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {!hasStructure && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleInitialize(cohort.id)}
                        disabled={isPending}
                        title="Initialiseer structuur"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Link href={`/demo/beheer/cohorten/${cohort.id}`}>
                      <Button variant="ghost" size="icon" title="Bewerken">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cohort.id, cohort.name)}
                      disabled={isPending}
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
