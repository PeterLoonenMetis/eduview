"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, GraduationCap, Check } from "lucide-react";
import {
  HBO_VARIANT_OPTIONS,
  HBO_TOETSFILOSOFIE_OPTIONS,
  HBO_ORDENINGSPRINCIPE_OPTIONS,
  HBO_TIJDSNEDE_OPTIONS,
  HBO_DEGREE_OPTIONS,
} from "@/lib/education-types/hbo";
import { createHBOProgramAction } from "@/app/actions/program-wizard";

interface Academy {
  id: string;
  name: string;
  code: string;
}

interface HBOWizardFormProps {
  academies: Academy[];
}

export function HBOWizardForm({ academies }: HBOWizardFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, formAction, isPending] = useActionState(createHBOProgramAction, {
    success: false,
  });

  // Redirect on success
  useEffect(() => {
    if (state.success && state.programId) {
      router.push(`/demo/beheer/opleidingen/${state.programId}`);
    }
  }, [state.success, state.programId, router]);

  // Use first academy as default, or show error if no academies
  const defaultAcademyId = academies.length > 0 ? academies[0].id : "";

  if (academies.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="error" title="Geen academie beschikbaar">
          Er zijn nog geen academies aangemaakt. Maak eerst een academie aan voordat je een opleiding kunt toevoegen.
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">HBO Opleiding configureren</h1>
          <p className="text-muted-foreground">Configureer je nieuwe HBO-opleiding in een paar stappen</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3">
        <StepIndicator step={1} label="Type" completed />
        <div className="h-px w-8 bg-teal-500" />
        <StepIndicator step={2} label="Basis" active={step === 1} completed={step > 1} />
        <div className="h-px w-8 bg-border" />
        <StepIndicator step={3} label="Configuratie" active={step === 2} completed={step > 2} />
        <div className="h-px w-8 bg-border" />
        <StepIndicator step={4} label="Klaar" active={state.success} />
      </div>

      {state.error && (
        <Alert variant="error" title="Fout">
          {state.error}
        </Alert>
      )}

      <form action={formAction}>
        {step === 1 && (
          <div className="space-y-6">
            {/* Basic Program Info */}
            <Card>
              <CardHeader>
                <CardTitle>Stap 2: Basisgegevens opleiding</CardTitle>
                <CardDescription>Vul de algemene gegevens van de opleiding in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Academy selector */}
                <Select
                  name="academyId"
                  label="Academie / School"
                  options={academies.map((academy) => ({
                    value: academy.id,
                    label: `${academy.name} (${academy.code})`,
                  }))}
                  defaultValue={defaultAcademyId}
                  required
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    name="name"
                    label="Naam opleiding"
                    placeholder="bijv. HBO-ICT"
                    required
                  />
                  <Input
                    name="code"
                    label="Opleidingscode"
                    placeholder="bijv. ICT"
                    required
                    maxLength={10}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    name="crohoCode"
                    label="CROHO/ISAT code (optioneel)"
                    placeholder="bijv. 34479"
                  />
                  <Input
                    name="domein"
                    label="Domein (optioneel)"
                    placeholder="bijv. Techniek"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Select
                    name="degreeType"
                    label="Type diploma"
                    options={HBO_DEGREE_OPTIONS.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    defaultValue="BACHELOR"
                  />
                  <Input
                    name="durationYears"
                    label="Duur (jaren)"
                    type="number"
                    min={1}
                    max={6}
                    defaultValue={4}
                  />
                  <Input
                    name="totalCredits"
                    label="Totaal EC"
                    type="number"
                    min={30}
                    max={300}
                    defaultValue={240}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Link href="/demo/nieuw">
                <Button type="button" variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug
                </Button>
              </Link>
              <Button type="button" onClick={() => setStep(2)}>
                Volgende stap
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* HBO Config */}
            <Card>
              <CardHeader>
                <CardTitle>Stap 3: HBO Configuratie</CardTitle>
                <CardDescription>
                  Stel de HBO-specifieke opties in voor het curriculum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select
                  name="variant"
                  label="Opleidingsvariant"
                  options={HBO_VARIANT_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: `${opt.label} - ${opt.description}`,
                  }))}
                  defaultValue="VOLTIJD"
                />

                <Select
                  name="toetsfilosofie"
                  label="Toetsfilosofie"
                  options={HBO_TOETSFILOSOFIE_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  defaultValue="TRADITIONEEL"
                />
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  <p className="font-medium mb-2">Wat betekent dit?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <strong>Programmatisch:</strong> Bewijslast, feedbackmomenten en beslismomenten
                    </li>
                    <li>
                      <strong>Traditioneel:</strong> Toetsmomenten, weging, herkansing en normering
                    </li>
                  </ul>
                </div>

                <Select
                  name="ordeningsprincipe"
                  label="Ordeningsprincipe curriculum"
                  options={HBO_ORDENINGSPRINCIPE_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: `${opt.label} - ${opt.description}`,
                  }))}
                  defaultValue="THEMAS"
                />

                <Select
                  name="tijdsnede"
                  label="Tijdsnede"
                  options={HBO_TIJDSNEDE_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: `${opt.label} - ${opt.description}`,
                  }))}
                  defaultValue="SEMESTER"
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Bezig met aanmaken..." : "Opleiding aanmaken"}
                <Check className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </form>
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
        {completed ? <Check className="h-4 w-4" /> : step}
      </div>
      <span
        className={`text-xs ${active || completed ? "text-teal-700 font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}
