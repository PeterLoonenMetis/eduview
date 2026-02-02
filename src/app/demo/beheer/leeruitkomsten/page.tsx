import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OutcomeList } from "@/components/admin/learning-outcome/outcome-list";
import { getLearningOutcomes } from "@/lib/db/learning-outcomes";
import { getCohorts } from "@/lib/db/cohorts";
import { Plus } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

export default async function LeeruitkomstenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Als geen cohort geselecteerd, neem het eerste actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      redirect(`/demo/beheer/leeruitkomsten?cohortId=${activeCohort.id}`);
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Leeruitkomsten</h1>
          <p className="text-muted-foreground">
            Beheer de leeruitkomsten van het curriculum
          </p>
        </div>
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen cohorten gevonden</h3>
          <p className="text-muted-foreground mt-1">
            Maak eerst een cohort aan om leeruitkomsten te kunnen beheren.
          </p>
          <Link href="/demo/beheer/cohorten/nieuw" className="mt-4 inline-block">
            <Button>Nieuw cohort aanmaken</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);
  const outcomes = await getLearningOutcomes(selectedCohortId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leeruitkomsten</h1>
          <p className="text-muted-foreground">
            Beheer de leeruitkomsten van het curriculum
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Cohort selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cohort:</span>
            <select
              value={selectedCohortId}
              onChange={(e) => {
                window.location.href = `/demo/beheer/leeruitkomsten?cohortId=${e.target.value}`;
              }}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.name} ({cohort.program.name})
                </option>
              ))}
            </select>
          </div>

          <Link href={`/demo/beheer/leeruitkomsten/nieuw?cohortId=${selectedCohortId}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe leeruitkomst
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{outcomes.length}</div>
          <div className="text-sm text-muted-foreground">Totaal</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {outcomes.filter(o => o.category === "KNOWLEDGE").length}
          </div>
          <div className="text-sm text-muted-foreground">Kennis</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {outcomes.filter(o => o.category === "SKILLS").length}
          </div>
          <div className="text-sm text-muted-foreground">Vaardigheden</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {outcomes.filter(o => o.category === "ATTITUDE").length}
          </div>
          <div className="text-sm text-muted-foreground">Houding</div>
        </div>
      </div>

      <OutcomeList outcomes={outcomes} />

      {selectedCohort && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Cohort:</strong> {selectedCohort.name} | <strong>Opleiding:</strong> {selectedCohort.program.name} | <strong>Periode:</strong> {selectedCohort.startYear}-{selectedCohort.endYear}
          </p>
        </div>
      )}
    </div>
  );
}
