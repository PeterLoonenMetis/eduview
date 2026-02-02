import Link from "next/link";
import { redirect } from "next/navigation";
import { BlockCard } from "@/components/curriculum/block-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { getCohortById, getCohorts } from "@/lib/db/cohorts";
import type { VisionType, RelationStrength } from "@prisma/client";

// Transform vision relations array to the expected format
function transformVisionRelations(relations: { visionType: VisionType; strength: RelationStrength }[]) {
  const result: {
    learning: "STRONG" | "MODERATE" | "WEAK" | null;
    profession: "STRONG" | "MODERATE" | "WEAK" | null;
    assessment: "STRONG" | "MODERATE" | "WEAK" | null;
  } = {
    learning: null,
    profession: null,
    assessment: null,
  };

  for (const rel of relations) {
    const strength = rel.strength as "STRONG" | "MODERATE" | "WEAK";
    if (rel.visionType === "LEARNING") result.learning = strength;
    if (rel.visionType === "PROFESSION") result.profession = strength;
    if (rel.visionType === "ASSESSMENT") result.assessment = strength;
  }

  return result;
}

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

export default async function CurriculumPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Bepaal het actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      redirect(`/demo/curriculum?cohortId=${activeCohort.id}`);
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Curriculum Overzicht</h1>
          <p className="mt-1 text-muted-foreground">
            Geen cohorten beschikbaar
          </p>
        </div>
      </div>
    );
  }

  const cohort = await getCohortById(selectedCohortId);
  if (!cohort) {
    redirect("/demo/curriculum");
  }

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Curriculum Overzicht</h1>
          <p className="mt-1 text-muted-foreground">
            Visueel overzicht van alle leerjaren en blokken.
          </p>
        </div>
        <div className="flex gap-2">
          {cohorts.length > 1 && (
            <select
              value={selectedCohortId}
              onChange={(e) => {
                window.location.href = `/demo/curriculum?cohortId=${e.target.value}`;
              }}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.program.name})
                </option>
              ))}
            </select>
          )}
          <Link href={`/demo/beheer/curriculum?cohortId=${selectedCohortId}`}>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Beheer
            </Button>
          </Link>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-white p-4">
        <span className="text-sm font-medium">Legenda:</span>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-primary-500" />
          <span className="text-sm">Onderwijsblok</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-secondary-500" />
          <span className="text-sm">Stage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-purple-500" />
          <span className="text-sm">Afstuderen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-blue-500" />
          <span className="text-sm">Keuzevak</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            <strong>L</strong> = Leren
          </span>
          <span>
            <strong>B</strong> = Beroep
          </span>
          <span>
            <strong>T</strong> = Toetsing
          </span>
        </div>
      </div>

      {/* Years */}
      {cohort.academicYears.length === 0 ? (
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen academische jaren</h3>
          <p className="text-muted-foreground mt-1">
            Initialiseer het cohort om de jaarstructuur aan te maken.
          </p>
          <Link href={`/demo/beheer/cohorten/${selectedCohortId}`} className="mt-4 inline-block">
            <Button>Naar cohort beheer</Button>
          </Link>
        </div>
      ) : (
        cohort.academicYears.map((year) => {
          const actualCredits = year.blocks.reduce((sum, b) => sum + b.credits, 0);
          const isComplete = actualCredits === year.targetCredits;

          return (
            <section key={year.id} className="space-y-4">
              {/* Year Header */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-xl font-bold text-primary-600">
                    {year.yearNumber}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Jaar {year.yearNumber} - {year.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {year.blocks.length} blokken
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {actualCredits}/{year.targetCredits} EC
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isComplete ? "Compleet" : "Incompleet"}
                    </p>
                  </div>
                  <Badge variant={isComplete ? "success" : "warning"}>
                    {isComplete ? "✓" : "!"}
                  </Badge>
                </div>
              </div>

              {/* Blocks Grid */}
              {year.blocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground rounded-lg border border-dashed">
                  Nog geen blokken in dit jaar
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {year.blocks.map((block) => (
                    <BlockCard
                      key={block.id}
                      id={block.id}
                      code={block.code}
                      name={block.name}
                      shortDescription={block.shortDescription}
                      type={block.type}
                      credits={block.credits}
                      status={block.status}
                      assessmentCount={block._count.assessments}
                      durationWeeks={block.durationWeeks}
                      visionRelations={transformVisionRelations(block.visionRelations)}
                      href={`/demo/curriculum/blok/${block.id}`}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}

      {selectedCohort && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Cohort:</strong> {selectedCohort.name} | <strong>Opleiding:</strong> {selectedCohort.program.name}
          </p>
        </div>
      )}
    </div>
  );
}
