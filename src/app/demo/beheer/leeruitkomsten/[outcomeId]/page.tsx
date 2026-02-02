import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OutcomeForm } from "@/components/admin/learning-outcome/outcome-form";
import { getLearningOutcomeById } from "@/lib/db/learning-outcomes";
import { getCohorts } from "@/lib/db/cohorts";
import { ArrowLeft, BookOpen, ClipboardCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ outcomeId: string }>;
}

export default async function EditLeeruitkomstPage({ params }: PageProps) {
  const { outcomeId } = await params;
  const [outcome, cohorts] = await Promise.all([
    getLearningOutcomeById(outcomeId),
    getCohorts(),
  ]);

  if (!outcome) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/demo/beheer/leeruitkomsten?cohortId=${outcome.cohortId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-teal-700">{outcome.code}</span> - {outcome.title}
          </h1>
          <p className="text-muted-foreground">
            {outcome.cohort.program.name} - {outcome.cohort.name}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <OutcomeForm outcome={outcome} cohorts={cohorts} />
      </div>

      {/* Gekoppelde visies */}
      {outcome.visionLinks.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Gekoppelde visies
          </h2>
          <div className="space-y-2">
            {outcome.visionLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div>
                  <span className="font-medium">{link.vision.title}</span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({link.vision.type === "LEARNING" ? "Leren" : link.vision.type === "PROFESSION" ? "Beroep" : "Toetsing"})
                  </span>
                </div>
                <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                  {link.relevance === "PRIMARY" ? "Primair" : link.relevance === "SECONDARY" ? "Secundair" : "Tertiair"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gekoppelde toetsen */}
      {outcome.assessmentOutcomes.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Gekoppelde toetsen
          </h2>
          <div className="space-y-2">
            {outcome.assessmentOutcomes.map((ao) => (
              <Link
                key={ao.id}
                href={`/demo/beheer/curriculum/blok/${ao.assessment.blockId}`}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <span className="font-medium">{ao.assessment.title}</span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    {ao.assessment.block.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Weging: {ao.weight}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
