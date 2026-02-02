import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCohortById, getCohorts } from "@/lib/db/cohorts";
import { Plus, Calendar, BookOpen, ClipboardCheck } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

const typeColors: Record<string, string> = {
  EDUCATIONAL: "bg-teal-100 border-teal-300 text-teal-800",
  PROJECT: "bg-blue-100 border-blue-300 text-blue-800",
  PRACTICAL: "bg-green-100 border-green-300 text-green-800",
  INTERNSHIP: "bg-amber-100 border-amber-300 text-amber-800",
  GRADUATION: "bg-purple-100 border-purple-300 text-purple-800",
};

const typeLabels: Record<string, string> = {
  EDUCATIONAL: "Onderwijs",
  PROJECT: "Project",
  PRACTICAL: "Praktijk",
  INTERNSHIP: "Stage",
  GRADUATION: "Afstuderen",
};

export default async function CurriculumPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Als geen cohort geselecteerd, neem het eerste actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      redirect(`/demo/beheer/curriculum?cohortId=${activeCohort.id}`);
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Curriculum</h1>
          <p className="text-muted-foreground">
            Beheer de curriculumstructuur met jaren en blokken
          </p>
        </div>
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen cohorten gevonden</h3>
          <p className="text-muted-foreground mt-1">
            Maak eerst een cohort aan om het curriculum te kunnen beheren.
          </p>
          <Link href="/demo/beheer/cohorten/nieuw" className="mt-4 inline-block">
            <Button>Nieuw cohort aanmaken</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cohort = await getCohortById(selectedCohortId);

  if (!cohort) {
    redirect("/demo/beheer/curriculum");
  }

  const totalCredits = cohort.academicYears.reduce(
    (sum, year) => sum + year.blocks.reduce((s, b) => s + b.credits, 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Curriculum</h1>
          <p className="text-muted-foreground">
            Beheer de curriculumstructuur met jaren en blokken
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Cohort selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cohort:</span>
            <select
              value={selectedCohortId}
              onChange={(e) => {
                window.location.href = `/demo/beheer/curriculum?cohortId=${e.target.value}`;
              }}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.program.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <span className="text-sm text-muted-foreground">Jaren</span>
          </div>
          <div className="text-2xl font-bold mt-1">{cohort.academicYears.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-muted-foreground">Blokken</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {cohort.academicYears.reduce((sum, y) => sum + y.blocks.length, 0)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Studiepunten</span>
          </div>
          <div className="text-2xl font-bold mt-1">{totalCredits} EC</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Doel</span>
          </div>
          <div className="text-2xl font-bold mt-1">{cohort.program.totalCredits} EC</div>
          <div className="text-xs text-muted-foreground">
            {totalCredits < cohort.program.totalCredits && (
              <span className="text-amber-600">
                Nog {cohort.program.totalCredits - totalCredits} EC nodig
              </span>
            )}
            {totalCredits === cohort.program.totalCredits && (
              <span className="text-green-600">Compleet</span>
            )}
            {totalCredits > cohort.program.totalCredits && (
              <span className="text-red-600">
                {totalCredits - cohort.program.totalCredits} EC te veel
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Jaren en blokken */}
      {cohort.academicYears.length === 0 ? (
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen academische jaren</h3>
          <p className="text-muted-foreground mt-1">
            Initialiseer het cohort om de jaarstructuur aan te maken.
          </p>
          <Link href={`/demo/beheer/cohorten/${selectedCohortId}`} className="mt-4 inline-block">
            <Button>Naar cohort</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cohort.academicYears.map((year) => {
            const yearCredits = year.blocks.reduce((sum, b) => sum + b.credits, 0);

            return (
              <div key={year.id} className="rounded-lg border bg-card">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Jaar {year.yearNumber}: {year.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {year.blocks.length} blokken | {yearCredits}/{year.targetCredits} EC
                    </p>
                  </div>
                  <Link href={`/demo/beheer/curriculum/blok/nieuw?yearId=${year.id}`}>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Blok toevoegen
                    </Button>
                  </Link>
                </div>

                <div className="p-4">
                  {year.blocks.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      Nog geen blokken toegevoegd aan dit jaar.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {year.blocks.map((block) => (
                        <Link
                          key={block.id}
                          href={`/demo/beheer/curriculum/blok/${block.id}`}
                          className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                          style={{ borderLeftColor: block.color || "#164B44", borderLeftWidth: "4px" }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {block.code}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${typeColors[block.type]}`}>
                              {typeLabels[block.type]}
                            </span>
                          </div>
                          <h3 className="font-medium mb-1">{block.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {block.shortDescription}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{block.credits} EC</span>
                            <span>
                              {block._count.teachingUnits} OE | {block._count.assessments} toetsen
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cohort && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Cohort:</strong> {cohort.name} | <strong>Opleiding:</strong> {cohort.program.name} | <strong>Periode:</strong> {cohort.startYear}-{cohort.endYear}
          </p>
        </div>
      )}
    </div>
  );
}
