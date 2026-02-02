"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getLabel, statusColors } from "@/lib/utils";
import { GraduationCap, Briefcase, ClipboardCheck, ArrowRight } from "lucide-react";

interface VisionCardProps {
  type: "LEARNING" | "PROFESSION" | "ASSESSMENT";
  title: string;
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "ARCHIVED";
  principleCount: number;
  href: string;
}

const visionIcons = {
  LEARNING: GraduationCap,
  PROFESSION: Briefcase,
  ASSESSMENT: ClipboardCheck,
};

const visionColors = {
  LEARNING: "bg-primary-500",
  PROFESSION: "bg-secondary-500",
  ASSESSMENT: "bg-accent-500",
};

export function VisionCard({
  type,
  title,
  status,
  principleCount,
  href,
}: VisionCardProps) {
  const Icon = visionIcons[type];
  const statusColor = statusColors[status];
  const iconBg = visionColors[type];

  return (
    <Link href={href}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary-300">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className={cn("rounded-xl p-3", iconBg)}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <Badge
              variant="outline"
              className={cn(statusColor.bg, statusColor.text)}
            >
              <span
                className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", statusColor.dot)}
              />
              {getLabel(status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <CardTitle className="text-lg group-hover:text-primary-600">
              {title}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {principleCount} uitgangspunten
            </p>
          </div>

          <div className="flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600">
            Bekijken
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
