import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CohortForm } from "@/components/admin/cohort/cohort-form";
import { getCohortById } from "@/lib/db/cohorts";
import { getPrograms } from "@/lib/db/programs";
import { ArrowLeft, BookOpen, Target, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ cohortId: string }>;
}

export default async function EditCohortPage({ params }: PageProps) {
  const { cohortId } = await params;
  const [cohort, programs] = await Promise.all([
    getCohortById(cohortId),
    getPrograms(),
  ]);

  if (!cohort) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/demo/beheer/cohorten">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{cohort.name} bewerken</h1>
          <p className="text-muted-foreground">
            {cohort.program.name} ({cohort.startYear}-{cohort.endYear})
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CohortForm cohort={cohort} programs={programs} />
      </div>

      {/* Quick links naar onderdelen */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Visies */}
        <Link
          href={`/demo/beheer/visies?cohortId=${cohort.id}`}
          className="rounded-lg border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-100 p-2">
              <BookOpen className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-semibold">Visies</h3>
              <p className="text-sm text-muted-foreground">
                {cohort.visions.length} visies gedefinieerd
              </p>
            </div>
          </div>
        </Link>

        {/* Leeruitkomsten */}
        <Link
          href={`/demo/beheer/leeruitkomsten?cohortId=${cohort.id}`}
          className="rounded-lg border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <Target className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold">Leeruitkomsten</h3>
              <p className="text-sm text-muted-foreground">
                {cohort.learningOutcomes.length} leeruitkomsten
              </p>
            </div>
          </div>
        </Link>

        {/* Curriculum */}
        <Link
          href={`/demo/beheer/curriculum?cohortId=${cohort.id}`}
          className="rounded-lg border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-semibold">Curriculum</h3>
              <p className="text-sm text-muted-foreground">
                {cohort.academicYears.length} jaren,{" "}
                {cohort.academicYears.reduce((sum, y) => sum + y.blocks.length, 0)} blokken
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Academische jaren overzicht */}
      {cohort.academicYears.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Curriculumstructuur</h2>
          <div className="space-y-4">
            {cohort.academicYears.map((year) => (
              <div key={year.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">
                    Jaar {year.yearNumber}: {year.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {year.targetCredits} EC
                  </span>
                </div>
                {year.blocks.length > 0 ? (
                  <div className="grid gap-2 md:grid-cols-4">
                    {year.blocks.map((block) => (
                      <Link
                        key={block.id}
                        href={`/demo/beheer/curriculum/blok/${block.id}`}
                        className="rounded-md border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-medium text-sm">{block.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {block.credits} EC | {block._count.teachingUnits} OE | {block._count.assessments} toetsen
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nog geen blokken toegevoegd
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
