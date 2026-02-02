import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgramForm } from "@/components/admin/program/program-form";
import { getProgramById } from "@/lib/db/programs";
import { getAcademies, getInstitutes } from "@/lib/db/institutes";
import { ArrowLeft, School, GraduationCap, Settings } from "lucide-react";
import { EducationConfigSection } from "@/components/config/education-config-section";

interface PageProps {
  params: Promise<{ programId: string }>;
}

export default async function EditProgramPage({ params }: PageProps) {
  const { programId } = await params;
  const [program, academies, institutes] = await Promise.all([
    getProgramById(programId),
    getAcademies(),
    getInstitutes(),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/demo/beheer/opleidingen">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
          program.educationType === "MBO" ? "bg-blue-100" : "bg-teal-100"
        }`}>
          {program.educationType === "MBO" ? (
            <School className="h-6 w-6 text-blue-600" />
          ) : (
            <GraduationCap className="h-6 w-6 text-teal-600" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{program.name}</h1>
            <Badge className={
              program.educationType === "MBO"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                : "bg-teal-100 text-teal-700 hover:bg-teal-100"
            }>
              {program.educationType}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Pas de gegevens van de opleiding aan
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ProgramForm program={program} academies={academies} institutes={institutes} />
      </div>

      {/* Onderwijstype configuratie */}
      <EducationConfigSection program={program} />

      {/* Cohorten overzicht */}
      {program.cohorts.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Cohorten</h2>
          <div className="space-y-2">
            {program.cohorts.map((cohort) => (
              <Link
                key={cohort.id}
                href={`/demo/beheer/cohorten/${cohort.id}`}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <span className="font-medium">{cohort.name}</span>
                  <span className="text-muted-foreground ml-2">
                    {cohort.startYear}-{cohort.startYear + 4}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{cohort._count.visions} visies</span>
                  <span>{cohort._count.learningOutcomes} leeruitkomsten</span>
                  <span>{cohort._count.academicYears} jaren</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
