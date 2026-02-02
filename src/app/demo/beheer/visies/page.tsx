import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getVisions } from "@/lib/db/visions";
import { getCohorts } from "@/lib/db/cohorts";
import { BookOpen, Briefcase, ClipboardCheck, ChevronRight, CheckCircle, FileText, Eye } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

const visionConfig = {
  LEARNING: {
    icon: BookOpen,
    label: "Visie op Leren en Onderwijs",
    color: "bg-teal-100 text-teal-700",
  },
  PROFESSION: {
    icon: Briefcase,
    label: "Visie op het Beroep",
    color: "bg-amber-100 text-amber-700",
  },
  ASSESSMENT: {
    icon: ClipboardCheck,
    label: "Visie op Toetsing en Examinering",
    color: "bg-blue-100 text-blue-700",
  },
};

const statusConfig: Record<string, { label: string; icon: typeof FileText; className: string }> = {
  DRAFT: { label: "Concept", icon: FileText, className: "text-yellow-600" },
  REVIEW: { label: "In review", icon: Eye, className: "text-blue-600" },
  APPROVED: { label: "Goedgekeurd", icon: CheckCircle, className: "text-green-600" },
  ARCHIVED: { label: "Gearchiveerd", icon: FileText, className: "text-gray-600" },
};

export default async function VisiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Als geen cohort geselecteerd, neem het eerste actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      redirect(`/demo/beheer/visies?cohortId=${activeCohort.id}`);
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visies</h1>
          <p className="text-muted-foreground">
            Beheer de drie visie-ankers van het curriculum
          </p>
        </div>
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen cohorten gevonden</h3>
          <p className="text-muted-foreground mt-1">
            Maak eerst een cohort aan om visies te kunnen bewerken.
          </p>
          <Link href="/demo/beheer/cohorten/nieuw" className="mt-4 inline-block">
            <Button>Nieuw cohort aanmaken</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);
  const visions = await getVisions(selectedCohortId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visies</h1>
          <p className="text-muted-foreground">
            Beheer de drie visie-ankers van het curriculum
          </p>
        </div>

        {/* Cohort selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Cohort:</span>
          <select
            value={selectedCohortId}
            onChange={(e) => {
              window.location.href = `/demo/beheer/visies?cohortId=${e.target.value}`;
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
      </div>

      {visions.length === 0 ? (
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen visies gevonden</h3>
          <p className="text-muted-foreground mt-1">
            Initialiseer het cohort om de drie visies aan te maken.
          </p>
          <Link href={`/demo/beheer/cohorten/${selectedCohortId}`} className="mt-4 inline-block">
            <Button>Naar cohort</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {visions.map((vision) => {
            const config = visionConfig[vision.type];
            const Icon = config.icon;
            const status = statusConfig[vision.status];
            const StatusIcon = status.icon;

            return (
              <Link
                key={vision.id}
                href={`/demo/beheer/visies/${vision.id}`}
                className="rounded-lg border bg-card p-6 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`rounded-lg p-3 ${config.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${status.className}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span>{status.label}</span>
                  </div>
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                  {vision.title || config.label}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {vision.content || "Nog geen inhoud toegevoegd"}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {vision.principles.length} uitgangspunten
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

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
