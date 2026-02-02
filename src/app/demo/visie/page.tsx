import Link from "next/link";
import { redirect } from "next/navigation";
import { VisionCard } from "@/components/curriculum/vision-card";
import { getVisions } from "@/lib/db/visions";
import { getCohorts } from "@/lib/db/cohorts";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

export default async function VisiePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Bepaal het actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      redirect(`/demo/visie?cohortId=${activeCohort.id}`);
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Visie</h1>
          <p className="mt-1 text-muted-foreground">
            Geen cohorten beschikbaar
          </p>
        </div>
      </div>
    );
  }

  const visions = await getVisions(selectedCohortId);
  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visie</h1>
          <p className="mt-1 text-muted-foreground">
            De drie visies vormen het fundament van het curriculum en waaraan alle
            onderdelen expliciet te relateren zijn.
          </p>
        </div>
        {cohorts.length > 1 && (
          <select
            value={selectedCohortId}
            onChange={(e) => {
              window.location.href = `/demo/visie?cohortId=${e.target.value}`;
            }}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name} ({cohort.program.name})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Vision Cards */}
      {visions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {visions.map((vision) => (
            <VisionCard
              key={vision.id}
              type={vision.type}
              title={vision.title}
              status={vision.status === "APPROVED" ? "APPROVED" : vision.status === "IN_REVIEW" ? "IN_REVIEW" : "DRAFT"}
              principleCount={vision.principles.length}
              href={`/demo/visie/${vision.type.toLowerCase()}?cohortId=${selectedCohortId}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen visies gedefinieerd</h3>
          <p className="text-muted-foreground mt-1">
            Initialiseer het cohort om de drie visies aan te maken.
          </p>
          <Link href={`/demo/beheer/cohorten/${selectedCohortId}`} className="mt-4 inline-block">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
              Naar cohort beheer
            </button>
          </Link>
        </div>
      )}

      {/* Explanation */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold">Over de drie ankerpunten</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-medium text-primary-600">
              Visie op Leren en Onderwijs
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Beschrijft de onderwijskundige uitgangspunten, didactische principes
              en de rol van docent en student in het leerproces.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-secondary-600">
              Visie op het Beroep
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Definieert het beroepsprofiel, de beroepsrollen en -taken, en de
              relatie met het landelijk opleidingsprofiel.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-accent-600">
              Visie op Toetsing en Examinering
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Legt de toetsprincipes vast, de verhouding formatief/summatief, en
              de manier waarop kwaliteit wordt geborgd.
            </p>
          </div>
        </div>
      </div>

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
