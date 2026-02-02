import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CohortForm } from "@/components/admin/cohort/cohort-form";
import { getPrograms } from "@/lib/db/programs";
import { ArrowLeft } from "lucide-react";

export default async function NieuwCohortPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/demo/beheer/cohorten">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nieuw cohort</h1>
          <p className="text-muted-foreground">
            Maak een nieuw cohort aan voor een opleiding
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CohortForm programs={programs} />
      </div>
    </div>
  );
}
