import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BlockForm } from "@/components/admin/block/block-form";
import { getBlockById } from "@/lib/db/blocks";
import { ArrowLeft, BookOpen, ClipboardCheck, Users, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ blockId: string }>;
}

export default async function EditBlockPage({ params }: PageProps) {
  const { blockId } = await params;
  const block = await getBlockById(blockId);

  if (!block) {
    notFound();
  }

  const cohort = block.academicYear.cohort;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/demo/beheer/curriculum?cohortId=${cohort.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-teal-700">{block.code}</span> - {block.name}
          </h1>
          <p className="text-muted-foreground">
            Jaar {block.academicYear.yearNumber} | {cohort.program.name} - {cohort.name}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-600" />
            <span className="text-sm text-muted-foreground">Onderwijseenheden</span>
          </div>
          <div className="text-2xl font-bold mt-1">{block.teachingUnits.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-muted-foreground">Toetsen</span>
          </div>
          <div className="text-2xl font-bold mt-1">{block.assessments.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Studiepunten</span>
          </div>
          <div className="text-2xl font-bold mt-1">{block.credits} EC</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-muted-foreground">Duur</span>
          </div>
          <div className="text-2xl font-bold mt-1">{block.durationWeeks} weken</div>
        </div>
      </div>

      {/* Block form */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Blok gegevens</h2>
        <BlockForm
          block={block}
          academicYears={[block.academicYear]}
        />
      </div>

      {/* Onderwijseenheden */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Onderwijseenheden</h2>
          <Button variant="outline" size="sm" disabled>
            Onderwijseenheid toevoegen
          </Button>
        </div>

        {block.teachingUnits.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Nog geen onderwijseenheden toegevoegd.
          </p>
        ) : (
          <div className="space-y-2">
            {block.teachingUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {unit.code}
                    </span>
                    <span className="font-medium">{unit.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {unit.weekPlannings.length} weken | {unit.assignments.length} opdrachten
                  </p>
                </div>
                <Button variant="ghost" size="sm" disabled>
                  Bewerken
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toetsen */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Toetsen</h2>
          <Button variant="outline" size="sm" disabled>
            Toets toevoegen
          </Button>
        </div>

        {block.assessments.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Nog geen toetsen toegevoegd.
          </p>
        ) : (
          <div className="space-y-2">
            {block.assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {assessment.code}
                    </span>
                    <span className="font-medium">{assessment.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assessment.assessmentType} | {assessment.weight}% weging | {assessment.outcomes.length} leeruitkomsten
                  </p>
                </div>
                <Button variant="ghost" size="sm" disabled>
                  Bewerken
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gekoppelde leeruitkomsten */}
      {block.assessments.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Leeruitkomsten in dit blok</h2>
          <div className="space-y-2">
            {Array.from(
              new Map(
                block.assessments
                  .flatMap(a => a.outcomes)
                  .map(ao => [ao.outcome.id, ao.outcome])
              ).values()
            ).map((outcome) => (
              <div
                key={outcome.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div>
                  <span className="font-mono text-sm text-teal-700 mr-2">
                    {outcome.code}
                  </span>
                  <span>{outcome.title}</span>
                </div>
                <Link href={`/demo/beheer/leeruitkomsten/${outcome.id}`}>
                  <Button variant="ghost" size="sm">
                    Bekijken
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
