import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BlockForm } from "@/components/admin/block/block-form";
import { getCohortById, getCohorts } from "@/lib/db/cohorts";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ yearId?: string; cohortId?: string }>;
}

export default async function NieuwBlokPage({ searchParams }: PageProps) {
  const params = await searchParams;

  let academicYears;
  let cohortId = params.cohortId;

  // Als yearId is opgegeven, haal de cohort op via het jaar
  if (params.yearId) {
    const year = await prisma.academicYear.findUnique({
      where: { id: params.yearId },
      include: { cohort: true },
    });

    if (year) {
      cohortId = year.cohortId;
    }
  }

  // Als we nog geen cohort hebben, pak het eerste actieve cohort
  if (!cohortId) {
    const cohorts = await getCohorts();
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      cohortId = activeCohort.id;
    }
  }

  if (!cohortId) {
    redirect("/demo/beheer/curriculum");
  }

  const cohort = await getCohortById(cohortId);

  if (!cohort) {
    redirect("/demo/beheer/curriculum");
  }

  academicYears = cohort.academicYears;

  if (academicYears.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/demo/beheer/curriculum?cohortId=${cohortId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nieuw blok</h1>
            <p className="text-muted-foreground">
              Geen academische jaren beschikbaar
            </p>
          </div>
        </div>
        <div className="text-center py-12 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium">Geen academische jaren</h3>
          <p className="text-muted-foreground mt-1">
            Initialiseer eerst het cohort om jaren aan te maken.
          </p>
          <Link href={`/demo/beheer/cohorten/${cohortId}`} className="mt-4 inline-block">
            <Button>Naar cohort</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/demo/beheer/curriculum?cohortId=${cohortId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nieuw blok</h1>
          <p className="text-muted-foreground">
            Voeg een nieuw blok toe aan het curriculum
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <BlockForm
          academicYears={academicYears}
          defaultAcademicYearId={params.yearId}
        />
      </div>
    </div>
  );
}
