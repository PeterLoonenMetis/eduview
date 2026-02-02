import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OutcomeForm } from "@/components/admin/learning-outcome/outcome-form";
import { getCohorts } from "@/lib/db/cohorts";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

export default async function NieuweLeeruitkomstPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/demo/beheer/leeruitkomsten${params.cohortId ? `?cohortId=${params.cohortId}` : ''}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nieuwe leeruitkomst</h1>
          <p className="text-muted-foreground">
            Definieer een nieuwe leeruitkomst voor het curriculum
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <OutcomeForm cohorts={cohorts} defaultCohortId={params.cohortId} />
      </div>
    </div>
  );
}
