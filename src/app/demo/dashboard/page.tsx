import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getCohortById, getCohorts } from "@/lib/db/cohorts";
import { getLearningOutcomes, getOutcomeCoverageMatrix } from "@/lib/db/learning-outcomes";
import { cn } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ cohortId?: string }>;
}

const typeLabels: Record<string, string> = {
  EDUCATIONAL: "Onderwijs",
  INTERNSHIP: "Stage",
  GRADUATION: "Afstuderen",
  ELECTIVE: "Keuzevak",
};

const typeColors: Record<string, string> = {
  EDUCATIONAL: "bg-primary-500",
  INTERNSHIP: "bg-secondary-500",
  GRADUATION: "bg-purple-500",
  ELECTIVE: "bg-blue-500",
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cohorts = await getCohorts();

  // Bepaal het actieve cohort
  let selectedCohortId = params.cohortId;
  if (!selectedCohortId) {
    const activeCohort = cohorts.find(c => c.isActive) || cohorts[0];
    if (activeCohort) {
      redirect(`/demo/dashboard?cohortId=${activeCohort.id}`);
    }
  }

  if (!selectedCohortId || cohorts.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Geen cohorten beschikbaar
          </p>
        </div>
      </div>
    );
  }

  const cohort = await getCohortById(selectedCohortId);
  if (!cohort) {
    redirect("/demo/dashboard");
  }

  const outcomes = await getLearningOutcomes(selectedCohortId);
  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);

  // Bereken stats
  const allBlocks = cohort.academicYears.flatMap(y => y.blocks);
  const totalCredits = allBlocks.reduce((sum, b) => sum + b.credits, 0);
  const totalAssessments = allBlocks.reduce((sum, b) => sum + b._count.assessments, 0);
  const approvedBlocks = allBlocks.filter(b => b.status === "APPROVED").length;
  const draftBlocks = allBlocks.filter(b => b.status !== "APPROVED").length;

  // Coverage matrix
  const coverageMatrix = await getOutcomeCoverageMatrix(selectedCohortId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Overzichten en analyses van het curriculum.
          </p>
        </div>
        <div className="flex gap-2">
          {cohorts.length > 1 && (
            <select
              value={selectedCohortId}
              onChange={(e) => {
                window.location.href = `/demo/dashboard?cohortId=${e.target.value}`;
              }}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.program.name})
                </option>
              ))}
            </select>
          )}
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Exporteer rapport
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary-600">
              {totalCredits}
            </div>
            <p className="text-sm text-muted-foreground">Totaal EC</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {totalCredits >= cohort.program.totalCredits ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Op schema ({cohort.program.totalCredits} EC)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-600">
                    Nog {cohort.program.totalCredits - totalCredits} EC nodig
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary-600">
              {outcomes.length}
            </div>
            <p className="text-sm text-muted-foreground">Leeruitkomsten</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {outcomes.length > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Gedefinieerd</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-600">Nog geen gedefinieerd</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary-600">
              {totalAssessments}
            </div>
            <p className="text-sm text-muted-foreground">Toetsen</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Verspreid over {allBlocks.length} blokken</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary-600">
              {approvedBlocks}
            </div>
            <p className="text-sm text-muted-foreground">Blokken vastgesteld</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {draftBlocks > 0 ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-600">{draftBlocks} in concept</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Alle vastgesteld</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EC Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>EC-Verdeling per Jaar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cohort.academicYears.map((year) => {
              const actualCredits = year.blocks.reduce((sum, b) => sum + b.credits, 0);
              const percentage = (actualCredits / year.targetCredits) * 100;
              const isComplete = actualCredits === year.targetCredits;

              return (
                <div key={year.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        Jaar {year.yearNumber} - {year.name}
                      </span>
                      {isComplete ? (
                        <Badge variant="success">Compleet</Badge>
                      ) : (
                        <Badge variant="warning">Incompleet</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {actualCredits} / {year.targetCredits} EC
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isComplete ? "bg-primary-500" : "bg-yellow-500"
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-6 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Totaal Opleiding</span>
              <span className="text-lg font-bold text-primary-600">
                {totalCredits} / {cohort.program.totalCredits} EC
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Matrix */}
      {outcomes.length > 0 && coverageMatrix.blocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dekkingsmatrix Leeruitkomsten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Leeruitkomst</th>
                    {coverageMatrix.blocks.slice(0, 8).map((block) => (
                      <th
                        key={block.id}
                        className="pb-3 text-center font-medium"
                        style={{ minWidth: "60px" }}
                      >
                        <div className="text-xs text-muted-foreground">
                          {block.code}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coverageMatrix.matrix.slice(0, 10).map((row) => (
                    <tr key={row.outcomeId} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{row.outcomeCode}</span>
                          <span className="text-muted-foreground truncate max-w-[200px]">
                            {row.outcomeTitle}
                          </span>
                        </div>
                      </td>
                      {row.coverage.slice(0, 8).map((cell) => (
                        <td key={cell.blockId} className="py-3 text-center">
                          {cell.isAssessed ? (
                            <span
                              className="inline-block h-3 w-3 rounded-full bg-primary-500"
                              title="Summatief getoetst"
                            />
                          ) : (
                            <span className="inline-block h-3 w-3 rounded-full bg-gray-100" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary-500" />
                <span>Summatief getoetst</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gray-100" />
                <span>Niet aan bod</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Toetsverdeling per Bloktype</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["EDUCATIONAL", "INTERNSHIP", "GRADUATION", "ELECTIVE"].map((type) => {
              const blocksOfType = allBlocks.filter((b) => b.type === type);
              const assessmentCount = blocksOfType.reduce(
                (sum, b) => sum + b._count.assessments,
                0
              );
              const creditSum = blocksOfType.reduce(
                (sum, b) => sum + b.credits,
                0
              );

              return (
                <div key={type} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 rounded", typeColors[type] || "bg-gray-500")} />
                    <span className="font-medium">{typeLabels[type] || type}</span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blokken</span>
                      <span className="font-medium">{blocksOfType.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Toetsen</span>
                      <span className="font-medium">{assessmentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">EC</span>
                      <span className="font-medium">{creditSum}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
