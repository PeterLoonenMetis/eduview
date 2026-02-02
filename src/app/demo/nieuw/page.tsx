"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EducationTypeSelector } from "@/components/config/education-type-selector";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

export default function NieuweOpleidingPage() {
  const router = useRouter();
  const [educationType, setEducationType] = useState<"MBO" | "HBO" | undefined>();

  const handleNext = () => {
    if (educationType) {
      router.push(`/demo/nieuw/${educationType.toLowerCase()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white mb-4">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">Nieuwe opleiding configureren</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start met het kiezen van het onderwijstype. Dit bepaalt welke configuratie-opties,
          terminologie en validaties worden gebruikt voor je curriculum.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3">
        <StepIndicator step={1} label="Type" active />
        <div className="h-px w-8 bg-border" />
        <StepIndicator step={2} label="Basis" />
        <div className="h-px w-8 bg-border" />
        <StepIndicator step={3} label="Configuratie" />
        <div className="h-px w-8 bg-border" />
        <StepIndicator step={4} label="Klaar" />
      </div>

      {/* Education Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Stap 1: Kies onderwijstype</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EducationTypeSelector value={educationType} onChange={setEducationType} />

          {educationType && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                {educationType === "MBO" ? (
                  <>
                    Je gaat een <strong>MBO-opleiding</strong> configureren. In de volgende stappen
                    kun je de leerweg, het niveau en het kwalificatiedossier instellen.
                  </>
                ) : (
                  <>
                    Je gaat een <strong>HBO-opleiding</strong> configureren. In de volgende stappen
                    kun je de variant, toetsfilosofie en het ordeningsprincipe instellen.
                  </>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/demo/beheer">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar beheer
          </Button>
        </Link>
        <Button onClick={handleNext} disabled={!educationType}>
          Volgende stap
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function StepIndicator({
  step,
  label,
  active = false,
  completed = false,
}: {
  step: number;
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
        h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
        ${completed ? "bg-teal-500 text-white" : ""}
        ${active && !completed ? "bg-teal-100 text-teal-700 ring-2 ring-teal-500" : ""}
        ${!active && !completed ? "bg-muted text-muted-foreground" : ""}
      `}
      >
        {step}
      </div>
      <span
        className={`text-xs ${active ? "text-teal-700 font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}
