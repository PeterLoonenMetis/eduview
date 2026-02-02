"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cn,
  getLabel,
  blockTypeColors,
  statusColors,
  ecToSbu,
} from "@/lib/utils";
import {
  BookOpen,
  Clock,
  FileCheck,
  Edit,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { mockBlockDetail, mockBlocks } from "@/lib/mock-data";

export default function BlockDetailPage() {
  const params = useParams();
  const blockId = params.blockId as string;

  // For demo, use mockBlockDetail for block-001, otherwise find in mockBlocks
  const block =
    blockId === "block-001"
      ? mockBlockDetail
      : mockBlocks.find((b) => b.id === blockId);

  if (!block) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-xl font-semibold">Blok niet gevonden</h1>
        <Link href="/demo/curriculum" className="mt-4 text-primary-500">
          Terug naar curriculum
        </Link>
      </div>
    );
  }

  const colors = blockTypeColors[block.type];
  const statusColor = statusColors[block.status];
  const totalSbu = ecToSbu(block.credits);

  // Calculate totals for detailed view
  const hasDetail = "teachingUnits" in block;
  const totalContactHours = hasDetail
    ? mockBlockDetail.teachingUnits.reduce((sum, u) => sum + u.contactHours, 0)
    : 0;
  const totalSelfStudy = hasDetail
    ? mockBlockDetail.teachingUnits.reduce((sum, u) => sum + u.selfStudyHours, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/demo/curriculum"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Terug naar overzicht
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className={cn("h-2", colors.bg)} />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {block.code}
              </p>
              <h1 className="mt-1 text-2xl font-bold">{block.name}</h1>
              <p className="mt-2 text-muted-foreground">
                {block.shortDescription}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(statusColor.bg, statusColor.text)}
              >
                <span
                  className={cn(
                    "mr-1.5 h-1.5 w-1.5 rounded-full",
                    statusColor.dot
                  )}
                />
                {getLabel(block.status)}
              </Badge>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Bewerken
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{block.credits} EC</span>
              <span className="text-muted-foreground">({totalSbu} SBU)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{block.durationWeeks} weken</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-muted-foreground" />
              <span>
                {hasDetail ? mockBlockDetail.assessments.length : "assessmentCount" in block ? block.assessmentCount : 0} toetsen
              </span>
            </div>
            <Badge className={cn(colors.bg, colors.text)}>
              {getLabel(block.type)}
            </Badge>
          </div>

          {/* Vision Relations */}
          {block.visionRelations && (
            <div className="mt-6 flex items-center gap-6">
              <span className="text-sm font-medium">Visie-relaties:</span>
              <VisionIndicator
                icon={GraduationCap}
                label="Leren"
                strength={block.visionRelations.learning}
              />
              <VisionIndicator
                icon={Briefcase}
                label="Beroep"
                strength={block.visionRelations.profession}
              />
              <VisionIndicator
                icon={ClipboardCheck}
                label="Toetsing"
                strength={block.visionRelations.assessment}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {hasDetail && mockBlockDetail.longDescription && (
            <Card>
              <CardHeader>
                <CardTitle>Beschrijving</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {mockBlockDetail.longDescription.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Week Planning */}
          {hasDetail && (
            <Card>
              <CardHeader>
                <CardTitle>Lesplanning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-left font-medium">Week</th>
                        <th className="pb-3 text-left font-medium">Thema</th>
                        <th className="pb-3 text-left font-medium">
                          Activiteiten
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBlockDetail.weekPlannings.map((week) => (
                        <tr key={week.weekNumber} className="border-b">
                          <td className="py-3 align-top font-medium">
                            {week.weekNumber}
                          </td>
                          <td className="py-3 align-top">{week.theme}</td>
                          <td className="py-3">
                            <ul className="list-disc pl-4 space-y-1">
                              {week.activities.map((activity, i) => (
                                <li key={i} className="text-muted-foreground">
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessments */}
          {hasDetail && (
            <Card>
              <CardHeader>
                <CardTitle>Toetsen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBlockDetail.assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {assessment.code}
                      </p>
                      <p className="font-medium">{assessment.title}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{getLabel(assessment.assessmentForm)}</span>
                        <span>•</span>
                        <span>Weging: {assessment.weight}%</span>
                        <span>•</span>
                        <span>Minimaal: {assessment.minimumGrade}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {assessment.credits} EC
                      </p>
                      <Badge variant={assessment.isSummative ? "default" : "outline"}>
                        {assessment.isSummative ? "Summatief" : "Formatief"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Teaching Units */}
          {hasDetail && (
            <Card>
              <CardHeader>
                <CardTitle>Onderwijseenheden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockBlockDetail.teachingUnits.map((unit) => (
                  <div key={unit.id} className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {unit.code}
                    </p>
                    <p className="font-medium">{unit.name}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{unit.credits} EC</span>
                      <span>
                        {unit.contactHours}u contact / {unit.selfStudyHours}u
                        zelfst.
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Study Load */}
          {hasDetail && (
            <Card>
              <CardHeader>
                <CardTitle>Studielast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contacturen</span>
                    <span className="font-medium">{totalContactHours} uur</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zelfstudie</span>
                    <span className="font-medium">{totalSelfStudy} uur</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-medium">Totaal</span>
                    <span className="font-semibold">
                      {totalContactHours + totalSelfStudy} SBU
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Verwacht: {totalSbu} SBU ({block.credits} EC × 28)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function VisionIndicator({
  icon: Icon,
  label,
  strength,
}: {
  icon: React.ElementType;
  label: string;
  strength: "STRONG" | "MODERATE" | "WEAK" | null;
}) {
  const strengthLabel =
    strength === "STRONG"
      ? "Sterk"
      : strength === "MODERATE"
      ? "Matig"
      : strength === "WEAK"
      ? "Zwak"
      : "Geen";

  const dotColor =
    strength === "STRONG"
      ? "bg-primary-500"
      : strength === "MODERATE"
      ? "bg-primary-300"
      : strength === "WEAK"
      ? "bg-primary-100"
      : "bg-gray-200";

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{label}:</span>
      <span className={cn("h-2 w-2 rounded-full", dotColor)} />
      <span className="text-muted-foreground">{strengthLabel}</span>
    </div>
  );
}
