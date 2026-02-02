import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Eye,
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { getCohorts } from "@/lib/db/cohorts";
import { getCohortById } from "@/lib/db/cohorts";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

export default async function DemoHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Bepaal het actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      selectedCohortId = activeCohort.id;
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Welkom bij CurriculumView</h1>
        <p className="text-muted-foreground mt-2">
          Er zijn nog geen cohorten aangemaakt. Ga naar de beheersomgeving om te beginnen.
        </p>
        <Link href="/demo/beheer" className="mt-4 inline-block text-teal-600 hover:underline">
          Naar Beheer
        </Link>
      </div>
    );
  }

  const cohort = await getCohortById(selectedCohortId);
  if (!cohort) {
    redirect("/demo");
  }

  const totalCredits = cohort.academicYears.reduce(
    (sum, year) => sum + year.blocks.reduce((s, b) => s + b.credits, 0),
    0
  );
  const totalBlocks = cohort.academicYears.reduce(
    (sum, year) => sum + year.blocks.length,
    0
  );
  const totalAssessments = cohort.academicYears.reduce(
    (sum, year) => sum + year.blocks.reduce((s, b) => s + b._count.assessments, 0),
    0
  );
  const approvedBlocks = cohort.academicYears.reduce(
    (sum, year) => sum + year.blocks.filter(b => b.status === "APPROVED").length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary-100">
              <GraduationCap className="h-5 w-5" />
              <span>Opleiding</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">{cohort.program.name}</h1>
            <p className="mt-1 text-primary-100">
              Cohort {cohort.name} • {cohort.program.durationYears} jaar •{" "}
              {cohort.program.totalCredits} EC
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cohort.isActive && (
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Actief
              </Badge>
            )}
            {cohorts.length > 1 && (
              <select
                value={selectedCohortId}
                onChange={(e) => {
                  window.location.href = `/demo?cohortId=${e.target.value}`;
                }}
                className="bg-white/20 text-white rounded-md px-2 py-1 text-sm border-0"
              >
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id} className="text-gray-900">
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold">{totalCredits}</p>
            <p className="text-sm text-primary-100">Totaal EC</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold">{totalBlocks}</p>
            <p className="text-sm text-primary-100">Blokken</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold">{totalAssessments}</p>
            <p className="text-sm text-primary-100">Toetsen</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold">{approvedBlocks}</p>
            <p className="text-sm text-primary-100">Vastgesteld</p>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Vision Card */}
        <Link href={`/demo/visie?cohortId=${selectedCohortId}`}>
          <Card className="group h-full transition-all hover:shadow-md hover:border-primary-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary-100 p-3">
                  <Eye className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary-600">
                    Visie
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {cohort.visions.length} visiedocumenten
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                De drie ankerpunten van het curriculum: leren, beroep en toetsing.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary-500">
                Bekijken
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Curriculum Card */}
        <Link href={`/demo/curriculum?cohortId=${selectedCohortId}`}>
          <Card className="group h-full transition-all hover:shadow-md hover:border-primary-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-secondary-100 p-3">
                  <BookOpen className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary-600">
                    Curriculum
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {cohort.academicYears.length} leerjaren, {totalBlocks} blokken
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Overzicht van alle blokken, onderwijseenheden en leeractiviteiten.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary-500">
                Bekijken
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Dashboard Card */}
        <Link href={`/demo/dashboard?cohortId=${selectedCohortId}`}>
          <Card className="group h-full transition-all hover:shadow-md hover:border-primary-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent-100 p-3">
                  <LayoutDashboard className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary-600">
                    Dashboard
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Analyses en rapportages
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dekkingsmatrix, EC-verdeling en toetsoverzichten.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary-500">
                Bekijken
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity / Vision Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vision Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visie Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cohort.visions.map((vision) => (
              <div
                key={vision.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      vision.status === "APPROVED"
                        ? "bg-green-500"
                        : vision.status === "IN_REVIEW"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{vision.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {vision.principles.length} uitgangspunten
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    vision.status === "APPROVED"
                      ? "success"
                      : vision.status === "IN_REVIEW"
                      ? "warning"
                      : "outline"
                  }
                >
                  {vision.status === "APPROVED"
                    ? "Vastgesteld"
                    : vision.status === "IN_REVIEW"
                    ? "In review"
                    : "Concept"}
                </Badge>
              </div>
            ))}
            {cohort.visions.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                Nog geen visies gedefinieerd
              </p>
            )}
          </CardContent>
        </Card>

        {/* Leeruitkomsten Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leeruitkomsten</CardTitle>
          </CardHeader>
          <CardContent>
            {cohort.learningOutcomes.length > 0 ? (
              <div className="space-y-2">
                {cohort.learningOutcomes.slice(0, 5).map((outcome) => (
                  <div key={outcome.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <span className="font-mono text-sm text-teal-700">{outcome.code}</span>
                    <span className="text-sm truncate">{outcome.title}</span>
                  </div>
                ))}
                {cohort.learningOutcomes.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{cohort.learningOutcomes.length - 5} meer leeruitkomsten
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Nog geen leeruitkomsten gedefinieerd
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
