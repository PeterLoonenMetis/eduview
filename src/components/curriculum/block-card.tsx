"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getLabel, blockTypeColors, statusColors } from "@/lib/utils";
import { BookOpen, FileCheck, Clock } from "lucide-react";

interface BlockCardProps {
  id: string;
  code: string;
  name: string;
  shortDescription: string;
  type: "EDUCATIONAL" | "PROJECT" | "PRACTICAL" | "INTERNSHIP" | "GRADUATION";
  credits: number;
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "ARCHIVED";
  assessmentCount: number;
  durationWeeks: number;
  visionRelations?: {
    learning: "STRONG" | "MODERATE" | "WEAK" | null;
    profession: "STRONG" | "MODERATE" | "WEAK" | null;
    assessment: "STRONG" | "MODERATE" | "WEAK" | null;
  };
  href: string;
}

export function BlockCard({
  code,
  name,
  shortDescription,
  type,
  credits,
  status,
  assessmentCount,
  durationWeeks,
  visionRelations,
  href,
}: BlockCardProps) {
  const colors = blockTypeColors[type];
  const statusColor = statusColors[status];

  return (
    <Link href={href}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary-300">
        {/* Type indicator bar */}
        <div className={cn("h-2 rounded-t-xl", colors.bg)} />

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{code}</p>
              <CardTitle className="text-lg group-hover:text-primary-600">
                {name}
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0",
                statusColor.bg,
                statusColor.text
              )}
            >
              <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", statusColor.dot)} />
              {getLabel(status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {shortDescription}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{credits} EC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span>{assessmentCount} toetsen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{durationWeeks} wkn</span>
            </div>
          </div>

          {/* Vision indicators */}
          {visionRelations && (
            <div className="flex items-center gap-2">
              <VisionDot
                label="L"
                strength={visionRelations.learning}
                title="Visie op Leren"
              />
              <VisionDot
                label="B"
                strength={visionRelations.profession}
                title="Visie op Beroep"
              />
              <VisionDot
                label="T"
                strength={visionRelations.assessment}
                title="Visie op Toetsing"
              />
            </div>
          )}

          {/* Type badge */}
          <Badge className={cn(colors.bg, colors.text)}>
            {getLabel(type)}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

function VisionDot({
  label,
  strength,
  title,
}: {
  label: string;
  strength: "STRONG" | "MODERATE" | "WEAK" | null;
  title: string;
}) {
  const dotColor =
    strength === "STRONG"
      ? "bg-primary-500"
      : strength === "MODERATE"
      ? "bg-primary-300"
      : strength === "WEAK"
      ? "bg-primary-100"
      : "bg-gray-200";

  return (
    <div
      className="flex items-center gap-1 text-xs text-muted-foreground"
      title={title}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", dotColor)} />
      <span>{label}</span>
    </div>
  );
}
