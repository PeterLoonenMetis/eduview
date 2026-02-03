"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, School, Check, Loader2, Plus, Building2 } from "lucide-react";
import {
  MBO_LEERWEG_OPTIONS,
  MBO_NIVEAU_OPTIONS,
  MBO_ONTWERPPRINCIPE_OPTIONS,
  MBO_DURATION_OPTIONS,
} from "@/lib/education-types/mbo";

interface Institute {
  id: string;
  name: string;
  code: string;
}

interface Academy {
  id: string;
  name: string;
  code: string;
  instituteId: string;
  institute: Institute;
}

interface MBOWizardFormProps {
  academies: Academy[];
}

export function MBOWizardForm({ academies: initialAcademies }: MBOWizardFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Academies list (can be updated when new ones are created)
  const [academies, setAcademies] = useState(initialAcademies);

  // Get unique institutes from academies
  const institutes = academies.reduce((acc, academy) => {
    if (!acc.find(i => i.id === academy.institute.id)) {
      acc.push(academy.institute);
    }
    return acc;
  }, [] as Institute[]);

  // Form state
  const [selectedInstituteId, setSelectedInstituteId] = useState(institutes[0]?.id || "");
  const [academyId, setAcademyId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [niveau, setNiveau] = useState("NIVEAU_4");
  const [durationYears, setDurationYears] = useState("4");
  const [leerweg, setLeerweg] = useState("BOL");
  const [ontwerpprincipe, setOntwerpprincipe] = useState("HYBRIDE");
  const [kdNaam, setKdNaam] = useState("");
  const [kdVersie, setKdVersie] = useState("");
  const [kdPeildatum, setKdPeildatum] = useState("");

  // New school/academy creation state
  const [showNewInstituteForm, setShowNewInstituteForm] = useState(false);
  const [showNewAcademyForm, setShowNewAcademyForm] = useState(false);
  const [newInstituteName, setNewInstituteName] = useState("");
  const [newInstituteCode, setNewInstituteCode] = useState("");
  const [newAcademyName, setNewAcademyName] = useState("");
  const [newAcademyCode, setNewAcademyCode] = useState("");
  const [isCreatingInstitute, setIsCreatingInstitute] = useState(false);
  const [isCreatingAcademy, setIsCreatingAcademy] = useState(false);

  // Filter academies for selected institute
  const filteredAcademies = academies.filter(a => a.instituteId === selectedInstituteId);

  // Auto-select first academy when institute changes
  const handleInstituteChange = (instituteId: string) => {
    setSelectedInstituteId(instituteId);
    setAcademyId("");
    setShowNewAcademyForm(false);
  };

  const handleCreateInstitute = async () => {
    if (!newInstituteName || !newInstituteCode) return;

    setIsCreatingInstitute(true);
    setError(null);

    try {
      const response = await fetch("/api/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newInstituteName,
          code: newInstituteCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new institute to the list
        const newInstitute = result.data;
        setSelectedInstituteId(newInstitute.id);
        setShowNewInstituteForm(false);
        setNewInstituteName("");
        setNewInstituteCode("");
        // Show academy form since the new institute has no academies
        setShowNewAcademyForm(true);
      } else {
        setError(result.error || "Kon school niet aanmaken");
      }
    } catch (err) {
      console.error("Create institute error:", err);
      setError("Kon geen verbinding maken met de server");
    } finally {
      setIsCreatingInstitute(false);
    }
  };

  const handleCreateAcademy = async () => {
    if (!selectedInstituteId || !newAcademyName || !newAcademyCode) return;

    setIsCreatingAcademy(true);
    setError(null);

    try {
      const response = await fetch("/api/academies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instituteId: selectedInstituteId,
          name: newAcademyName,
          code: newAcademyCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new academy to the list
        const newAcademy = result.data;
        setAcademies([...academies, newAcademy]);
        setAcademyId(newAcademy.id);
        setShowNewAcademyForm(false);
        setNewAcademyName("");
        setNewAcademyCode("");
      } else {
        setError(result.error || "Kon academie niet aanmaken");
      }
    } catch (err) {
      console.error("Create academy error:", err);
      setError("Kon geen verbinding maken met de server");
    } finally {
      setIsCreatingAcademy(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/programs/create-mbo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academyId,
          name,
          code,
          durationYears: parseInt(durationYears),
          niveau,
          leerweg,
          ontwerpprincipe,
          kdNaam: kdNaam || undefined,
          kdVersie: kdVersie || undefined,
          kdPeildatum: kdPeildatum || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/demo/beheer/opleidingen");
          router.refresh();
        }, 1000);
      } else {
        setError(result.error || "Er is een fout opgetreden");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Kon geen verbinding maken met de server");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (academies.length === 0 && !showNewInstituteForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert variant="warning" title="Geen school beschikbaar">
          Er zijn nog geen scholen of academies aangemaakt. Maak eerst een school aan.
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe school aanmaken</CardTitle>
            <CardDescription>Voeg een nieuwe school of instituut toe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naam school *
                </label>
                <input
                  type="text"
                  value={newInstituteName}
                  onChange={(e) => setNewInstituteName(e.target.value)}
                  placeholder="bijv. Techniek College Rotterdam"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={newInstituteCode}
                  onChange={(e) => setNewInstituteCode(e.target.value.toUpperCase())}
                  placeholder="bijv. TCR"
                  maxLength={10}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <Button
              onClick={handleCreateInstitute}
              disabled={isCreatingInstitute || !newInstituteName || !newInstituteCode}
            >
              {isCreatingInstitute ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Bezig...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  School aanmaken
                </>
              )}
            </Button>
          </CardContent>
        </Card>
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
        <StepIndicator step={4} label="Klaar" active={success} />
      </div>

      {error && (
        <Alert variant="error" title="Fout">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Succes!">
          De opleiding is aangemaakt. Je wordt doorgestuurd...
        </Alert>
      )}

      {step === 1 && !success && (
        <div className="space-y-6">
          {/* School Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Stap 2a: School / Instituut
              </CardTitle>
              <CardDescription>Kies een bestaande school of maak een nieuwe aan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showNewInstituteForm ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School / Instituut *
                    </label>
                    <select
                      value={selectedInstituteId}
                      onChange={(e) => handleInstituteChange(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    >
                      <option value="">-- Selecteer school --</option>
                      {institutes.map((institute) => (
                        <option key={institute.id} value={institute.id}>
                          {institute.name} ({institute.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewInstituteForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nieuwe school toevoegen
                  </Button>
                </>
              ) : (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">Nieuwe school aanmaken</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Naam school *
                      </label>
                      <input
                        type="text"
                        value={newInstituteName}
                        onChange={(e) => setNewInstituteName(e.target.value)}
                        placeholder="bijv. Techniek College Rotterdam"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code *
                      </label>
                      <input
                        type="text"
                        value={newInstituteCode}
                        onChange={(e) => setNewInstituteCode(e.target.value.toUpperCase())}
                        placeholder="bijv. TCR"
                        maxLength={10}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleCreateInstitute}
                      disabled={isCreatingInstitute || !newInstituteName || !newInstituteCode}
                      size="sm"
                    >
                      {isCreatingInstitute ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Bezig...
                        </>
                      ) : (
                        "School aanmaken"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewInstituteForm(false);
                        setNewInstituteName("");
                        setNewInstituteCode("");
                      }}
                    >
                      Annuleren
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academy Selection Card */}
          {selectedInstituteId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Stap 2b: Academie / Afdeling
                </CardTitle>
                <CardDescription>Kies een bestaande academie of maak een nieuwe aan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showNewAcademyForm ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Academie / Afdeling *
                      </label>
                      <select
                        value={academyId}
                        onChange={(e) => setAcademyId(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                      >
                        <option value="">-- Selecteer academie --</option>
                        {filteredAcademies.map((academy) => (
                          <option key={academy.id} value={academy.id}>
                            {academy.name} ({academy.code})
                          </option>
                        ))}
                      </select>
                      {filteredAcademies.length === 0 && (
                        <p className="mt-2 text-sm text-amber-600">
                          Deze school heeft nog geen academies. Maak er een aan.
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewAcademyForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nieuwe academie toevoegen
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900">Nieuwe academie aanmaken</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Naam academie *
                        </label>
                        <input
                          type="text"
                          value={newAcademyName}
                          onChange={(e) => setNewAcademyName(e.target.value)}
                          placeholder="bijv. Techniek & ICT"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code *
                        </label>
                        <input
                          type="text"
                          value={newAcademyCode}
                          onChange={(e) => setNewAcademyCode(e.target.value.toUpperCase())}
                          placeholder="bijv. TECH"
                          maxLength={10}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleCreateAcademy}
                        disabled={isCreatingAcademy || !newAcademyName || !newAcademyCode}
                        size="sm"
                      >
                        {isCreatingAcademy ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Bezig...
                          </>
                        ) : (
                          "Academie aanmaken"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewAcademyForm(false);
                          setNewAcademyName("");
                          setNewAcademyCode("");
                        }}
                      >
                        Annuleren
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Program Details Card */}
          {academyId && (
            <Card>
              <CardHeader>
                <CardTitle>Stap 2c: Basisgegevens opleiding</CardTitle>
                <CardDescription>Vul de algemene gegevens van de opleiding in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Naam opleiding *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="bijv. Mechatronica"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opleidingscode *
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="bijv. MECH"
                      maxLength={10}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MBO Niveau
                    </label>
                    <select
                      value={niveau}
                      onChange={(e) => setNiveau(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {MBO_NIVEAU_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opleidingsduur
                    </label>
                    <select
                      value={durationYears}
                      onChange={(e) => setDurationYears(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {MBO_DURATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value.toString()}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Link href="/demo/nieuw">
              <Button type="button" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug
              </Button>
            </Link>
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!name || !code || !academyId}
            >
              Volgende stap
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && !success && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stap 3: MBO Configuratie</CardTitle>
              <CardDescription>
                Stel de MBO-specifieke opties in voor het curriculum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leerweg
                </label>
                <select
                  value={leerweg}
                  onChange={(e) => setLeerweg(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {MBO_LEERWEG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>BOL:</strong> School-gestuurd onderwijs met stage</li>
                  <li><strong>BBL:</strong> Leren en werken gecombineerd (4 dagen werken, 1 dag school)</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ontwerpprincipe leeromgeving
                </label>
                <select
                  value={ontwerpprincipe}
                  onChange={(e) => setOntwerpprincipe(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {MBO_ONTWERPPRINCIPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label} - {opt.description}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kwalificatiedossier</CardTitle>
              <CardDescription>
                Optioneel: vul gegevens in over het kwalificatiedossier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naam kwalificatiedossier
                  </label>
                  <input
                    type="text"
                    value={kdNaam}
                    onChange={(e) => setKdNaam(e.target.value)}
                    placeholder="bijv. ICT- en Mediabeheer"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Versie
                  </label>
                  <input
                    type="text"
                    value={kdVersie}
                    onChange={(e) => setKdVersie(e.target.value)}
                    placeholder="bijv. 2024"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peildatum
                  </label>
                  <input
                    type="date"
                    value={kdPeildatum}
                    onChange={(e) => setKdPeildatum(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Bezig met aanmaken...
                </>
              ) : (
                <>
                  Opleiding aanmaken
                  <Check className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
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
