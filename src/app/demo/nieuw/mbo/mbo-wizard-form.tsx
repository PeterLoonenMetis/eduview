"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, School, Check } from "lucide-react";
import {
  MBO_LEERWEG_OPTIONS,
  MBO_NIVEAU_OPTIONS,
  MBO_ONTWERPPRINCIPE_OPTIONS,
  MBO_DURATION_OPTIONS,
} from "@/lib/education-types/mbo";
import { createMBOProgramAction } from "@/app/actions/program-wizard";

interface Academy {
  id: string;
  name: string;
  code: string;
}

interface MBOWizardFormProps {
  academies: Academy[];
}

export function MBOWizardForm({ academies }: MBOWizardFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, formAction, isPending] = useActionState(createMBOProgramAction, {
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
          <School className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">MBO Opleiding configureren</h1>
          <p className="text-muted-foreground">Configureer je nieuwe MBO-opleiding in een paar stappen</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3">
        <StepIndicator step={1} label="Type" completed />
        <div className="h-px w-8 bg-blue-500" />
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
                    placeholder="bijv. Applicatieontwikkelaar"
                    required
                  />
                  <Input
                    name="code"
                    label="Opleidingscode"
                    placeholder="bijv. AO"
                    required
                    maxLength={10}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    name="niveau"
                    label="MBO Niveau"
                    options={MBO_NIVEAU_OPTIONS.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    defaultValue="NIVEAU_4"
                  />
                  <Select
                    name="durationYears"
                    label="Opleidingsduur"
                    options={MBO_DURATION_OPTIONS.map((opt) => ({
                      value: opt.value.toString(),
                      label: opt.label,
                    }))}
                    defaultValue="4"
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
            {/* MBO Config */}
            <Card>
              <CardHeader>
                <CardTitle>Stap 3: MBO Configuratie</CardTitle>
                <CardDescription>
                  Stel de MBO-specifieke opties in voor het curriculum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select
                  name="leerweg"
                  label="Leerweg"
                  options={MBO_LEERWEG_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  defaultValue="BOL"
                />
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <strong>BOL:</strong> School-gestuurd onderwijs met stage
                    </li>
                    <li>
                      <strong>BBL:</strong> Leren en werken gecombineerd (4 dagen werken, 1 dag school)
                    </li>
                  </ul>
                </div>

                <Select
                  name="ontwerpprincipe"
                  label="Ontwerpprincipe leeromgeving"
                  options={MBO_ONTWERPPRINCIPE_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: `${opt.label} - ${opt.description}`,
                  }))}
                  defaultValue="HYBRIDE"
                />
              </CardContent>
            </Card>

            {/* Kwalificatiedossier */}
            <Card>
              <CardHeader>
                <CardTitle>Kwalificatiedossier</CardTitle>
                <CardDescription>
                  Optioneel: vul gegevens in over het kwalificatiedossier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    name="kdNaam"
                    label="Naam kwalificatiedossier"
                    placeholder="bijv. ICT- en Mediabeheer"
                  />
                  <Input name="kdVersie" label="Versie" placeholder="bijv. 2024" />
                  <Input name="kdPeildatum" label="Peildatum" type="date" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Na het aanmaken van de opleiding kun je kerntaken en werkprocessen toevoegen.
                </p>
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
        ${completed ? "bg-blue-500 text-white" : ""}
        ${active && !completed ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500" : ""}
        ${!active && !completed ? "bg-muted text-muted-foreground" : ""}
      `}
      >
        {completed ? <Check className="h-4 w-4" /> : step}
      </div>
      <span
        className={`text-xs ${active || completed ? "text-blue-700 font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}
