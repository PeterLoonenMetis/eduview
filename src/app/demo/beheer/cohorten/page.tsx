import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CohortList } from "@/components/admin/cohort/cohort-list";
import { getCohorts } from "@/lib/db/cohorts";
import { Plus } from "lucide-react";

export default async function CohortenPage() {
  const cohorts = await getCohorts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cohorten</h1>
          <p className="text-muted-foreground">
            Beheer alle cohorten binnen de opleidingen
          </p>
        </div>
        <Link href="/demo/beheer/cohorten/nieuw">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuw cohort
          </Button>
        </Link>
      </div>

      <CohortList cohorts={cohorts} />
    </div>
  );
}
