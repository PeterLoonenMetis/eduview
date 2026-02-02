"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Settings, School, GraduationCap } from "lucide-react";
import { MBOConfigForm } from "./mbo-config-form";
import { HBOConfigForm } from "./hbo-config-form";
import type { Program, MBOConfig, HBOConfig, Kerntaak, Werkproces, Keuzedeel } from "@prisma/client";

type MBOConfigWithRelations = MBOConfig & {
  kerntaken: (Kerntaak & { werkprocessen: Werkproces[] })[];
  keuzedelen: Keuzedeel[];
};

type ProgramWithConfig = Program & {
  mboConfig?: MBOConfigWithRelations | null;
  hboConfig?: HBOConfig | null;
};

interface EducationConfigSectionProps {
  program: ProgramWithConfig;
}

export function EducationConfigSection({ program }: EducationConfigSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasConfig = program.educationType === "MBO"
    ? !!program.mboConfig
    : !!program.hboConfig;

  const configSummary = program.educationType === "MBO" && program.mboConfig ? (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="outline">Leerweg: {program.mboConfig.leerweg}</Badge>
      <Badge variant="outline">Niveau: {program.mboConfig.niveau.replace("NIVEAU_", "")}</Badge>
      <Badge variant="outline">Ontwerpprincipe: {program.mboConfig.ontwerpprincipe.replace("_", " ")}</Badge>
      {program.mboConfig.kdNaam && (
        <Badge variant="outline">KD: {program.mboConfig.kdNaam}</Badge>
      )}
    </div>
  ) : program.educationType === "HBO" && program.hboConfig ? (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="outline">Variant: {program.hboConfig.variant}</Badge>
      <Badge variant="outline">Toetsfilosofie: {program.hboConfig.toetsfilosofie}</Badge>
      <Badge variant="outline">Ordeningsprincipe: {program.hboConfig.ordeningsprincipe}</Badge>
      <Badge variant="outline">Tijdsnede: {program.hboConfig.tijdsnede}</Badge>
    </div>
  ) : null;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
              program.educationType === "MBO" ? "bg-blue-100" : "bg-teal-100"
            }`}>
              {program.educationType === "MBO" ? (
                <School className="h-5 w-5 text-blue-600" />
              ) : (
                <GraduationCap className="h-5 w-5 text-teal-600" />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {program.educationType} Configuratie
                {hasConfig ? (
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                    Geconfigureerd
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Niet geconfigureerd
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {program.educationType === "MBO"
                  ? "Leerweg, niveau, kwalificatiedossier en ontwerpprincipe"
                  : "Variant, toetsfilosofie, ordeningsprincipe en tijdsnede"
                }
              </CardDescription>
              {!isExpanded && hasConfig && configSummary}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {program.educationType === "MBO" ? (
            <MBOConfigForm
              programId={program.id}
              config={program.mboConfig || undefined}
            />
          ) : (
            <HBOConfigForm
              programId={program.id}
              config={program.hboConfig || undefined}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}
