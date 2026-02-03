"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Dialog, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { createProgram, updateProgram, type ActionResult } from "@/app/actions/programs";
import { createAcademyDirect, createInstituteDirect } from "@/app/actions/academies";
import { Plus, Building2, School, GraduationCap } from "lucide-react";
import type { Program, Academy, Institute } from "@prisma/client";

interface AcademyWithInstitute extends Academy {
  institute: Institute;
}

interface ProgramFormProps {
  program?: Program;
  academies: AcademyWithInstitute[];
  institutes: Institute[];
  defaultAcademyId?: string;
}

const educationTypeOptions = [
  { value: "MBO", label: "MBO" },
  { value: "HBO", label: "HBO" },
];

const degreeTypeOptions = [
  { value: "BACHELOR", label: "Bachelor" },
  { value: "MASTER", label: "Master" },
  { value: "ASSOCIATE", label: "Associate Degree" },
  { value: "MBO4", label: "MBO Niveau 4" },
  { value: "MBO3", label: "MBO Niveau 3" },
  { value: "MBO2", label: "MBO Niveau 2" },
];

export function ProgramForm({
  program,
  academies: initialAcademies,
  institutes: initialInstitutes,
  defaultAcademyId
}: ProgramFormProps) {
  const router = useRouter();
  const isEditing = !!program;
  const action = isEditing
    ? updateProgram.bind(null, program.id)
    : createProgram;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  } as ActionResult);

  // Handle redirect after successful creation
  useEffect(() => {
    if (state.success && state.redirectTo) {
      // Small delay to ensure revalidation completes
      const timer = setTimeout(() => {
        router.push(state.redirectTo!);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  // Debug state changes
  useEffect(() => {
    if (state.error) {
      console.error("Form error:", state.error);
    }
    if (state.success) {
      console.log("Form success:", state.data);
    }
  }, [state]);

  // State for institutes and academies
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [academies, setAcademies] = useState(initialAcademies);

  // Selected values
  const [selectedInstituteId, setSelectedInstituteId] = useState<string>(
    defaultAcademyId
      ? academies.find(a => a.id === defaultAcademyId)?.instituteId || institutes[0]?.id || ""
      : institutes[0]?.id || ""
  );
  const [selectedAcademyId, setSelectedAcademyId] = useState<string>(
    defaultAcademyId || ""
  );

  // Dialog states
  const [showNewInstituteDialog, setShowNewInstituteDialog] = useState(false);
  const [showNewAcademyDialog, setShowNewAcademyDialog] = useState(false);
  const [newInstitute, setNewInstitute] = useState({ name: "", code: "" });
  const [newAcademy, setNewAcademy] = useState({ name: "", code: "" });
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isCreating, startCreating] = useTransition();

  // Filter academies for selected institute
  const filteredAcademies = academies.filter(a => a.instituteId === selectedInstituteId);

  // Auto-select first academy when institute changes
  const handleInstituteChange = (instituteId: string) => {
    setSelectedInstituteId(instituteId);
    const academiesForInstitute = academies.filter(a => a.instituteId === instituteId);
    if (academiesForInstitute.length > 0) {
      setSelectedAcademyId(academiesForInstitute[0].id);
    } else {
      setSelectedAcademyId("");
    }
  };

  // Create new institute
  const handleCreateInstitute = async () => {
    if (!newInstitute.name.trim() || !newInstitute.code.trim()) {
      setDialogError("Naam en code zijn verplicht");
      return;
    }

    startCreating(async () => {
      const result = await createInstituteDirect({
        name: newInstitute.name.trim(),
        code: newInstitute.code.trim().toUpperCase(),
      });

      if (result.success && result.data) {
        const newInstituteData = result.data as Institute;
        setInstitutes([...institutes, newInstituteData]);
        setSelectedInstituteId(newInstituteData.id);
        setSelectedAcademyId(""); // No academies yet for new institute
        setShowNewInstituteDialog(false);
        setNewInstitute({ name: "", code: "" });
        setDialogError(null);
      } else {
        setDialogError(result.error || "Er is een fout opgetreden");
      }
    });
  };

  // Create new academy
  const handleCreateAcademy = async () => {
    if (!newAcademy.name.trim() || !newAcademy.code.trim()) {
      setDialogError("Naam en code zijn verplicht");
      return;
    }

    if (!selectedInstituteId) {
      setDialogError("Selecteer eerst een school/instituut");
      return;
    }

    startCreating(async () => {
      const result = await createAcademyDirect({
        instituteId: selectedInstituteId,
        name: newAcademy.name.trim(),
        code: newAcademy.code.trim().toUpperCase(),
      });

      if (result.success && result.data) {
        const newAcademyData = result.data as AcademyWithInstitute;
        const institute = institutes.find(i => i.id === selectedInstituteId);
        if (institute) {
          newAcademyData.institute = institute;
        }
        setAcademies([...academies, newAcademyData]);
        setSelectedAcademyId(newAcademyData.id);
        setShowNewAcademyDialog(false);
        setNewAcademy({ name: "", code: "" });
        setDialogError(null);
      } else {
        setDialogError(result.error || "Er is een fout opgetreden");
      }
    });
  };

  return (
    <>
      <form action={formAction} className="space-y-8">
        {state.error && (
          <Alert variant="error" title="Fout">
            {state.error}
          </Alert>
        )}

        {state.success && (
          <Alert variant="success" title="Succes">
            Opleiding is {isEditing ? "bijgewerkt" : "aangemaakt"}.
          </Alert>
        )}

        {/* Step 1: School/Instituut */}
        {!isEditing && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold">Stap 1: Kies of maak een school/instituut</h3>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedInstituteId}
                onChange={(e) => handleInstituteChange(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">-- Selecteer school/instituut --</option>
                {institutes.map((institute) => (
                  <option key={institute.id} value={institute.id}>
                    {institute.name} ({institute.code})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogError(null);
                  setShowNewInstituteDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nieuwe school
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Bijvoorbeeld: Hogeschool Rotterdam, ROC Zadkine, Techniek College Rotterdam
            </p>
          </div>
        )}

        {/* Step 2: Academy/Faculteit */}
        {!isEditing && selectedInstituteId && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-4">
              <School className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold">Stap 2: Kies of maak een academie/faculteit</h3>
            </div>

            <div className="flex gap-2">
              <select
                name="academyId"
                value={selectedAcademyId}
                onChange={(e) => setSelectedAcademyId(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              >
                <option value="">-- Selecteer academie/faculteit --</option>
                {filteredAcademies.map((academy) => (
                  <option key={academy.id} value={academy.id}>
                    {academy.name} ({academy.code})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogError(null);
                  setShowNewAcademyDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nieuwe academie
              </Button>
            </div>
            {filteredAcademies.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                Deze school heeft nog geen academies. Maak eerst een academie aan.
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Bijvoorbeeld: Instituut voor Communicatie, Media en IT (CMI), Techniek, Zorg
            </p>
            {state.errors?.academyId?.[0] && (
              <p className="mt-1 text-sm text-red-600">{state.errors.academyId[0]}</p>
            )}
          </div>
        )}

        {/* Step 3: Opleiding details */}
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold">{isEditing ? "Opleidingsgegevens" : "Stap 3: Opleidingsgegevens"}</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="name"
              label="Naam opleiding"
              placeholder="bijv. Mechatronica, HBO-ICT, Verpleegkunde"
              defaultValue={program?.name}
              required
              error={state.errors?.name?.[0]}
            />

            <Input
              name="code"
              label="Code"
              placeholder="bijv. MECH, ICT, VPK"
              defaultValue={program?.code}
              required
              maxLength={10}
              error={state.errors?.code?.[0]}
            />

            <Select
              name="educationType"
              label="Onderwijstype"
              options={educationTypeOptions}
              defaultValue={program?.educationType || "MBO"}
              error={state.errors?.educationType?.[0]}
            />

            <Select
              name="degreeType"
              label="Niveau/Diploma"
              options={degreeTypeOptions}
              defaultValue={program?.degreeType || "MBO4"}
              error={state.errors?.degreeType?.[0]}
            />

            <Input
              name="crohoCode"
              label="CROHO/Crebo-code (optioneel)"
              placeholder="bijv. 34479 of 25604"
              defaultValue={program?.crohoCode || ""}
              maxLength={10}
              error={state.errors?.crohoCode?.[0]}
            />

            <Input
              name="durationYears"
              label="Duur (jaren)"
              type="number"
              min={1}
              max={6}
              defaultValue={program?.durationYears || 4}
              error={state.errors?.durationYears?.[0]}
            />

            <Input
              name="totalCredits"
              label="Totaal studiepunten (EC/SBU)"
              type="number"
              min={1}
              max={300}
              defaultValue={program?.totalCredits || 240}
              error={state.errors?.totalCredits?.[0]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuleren
          </Button>
          <Button
            type="submit"
            disabled={isPending || (!isEditing && (!selectedInstituteId || !selectedAcademyId))}
          >
            {isPending ? "Bezig..." : isEditing ? "Opslaan" : "Opleiding aanmaken"}
          </Button>
        </div>
      </form>

      {/* New Institute Dialog */}
      <Dialog open={showNewInstituteDialog} onClose={() => setShowNewInstituteDialog(false)}>
        <DialogHeader onClose={() => setShowNewInstituteDialog(false)}>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Nieuwe school/instituut toevoegen
          </div>
        </DialogHeader>
        <DialogContent>
          {dialogError && (
            <Alert variant="error" title="Fout">
              {dialogError}
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam school/instituut
              </label>
              <input
                type="text"
                value={newInstitute.name}
                onChange={(e) => setNewInstitute({ ...newInstitute, name: e.target.value })}
                placeholder="bijv. Techniek College Rotterdam"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Afkorting/Code
              </label>
              <input
                type="text"
                value={newInstitute.code}
                onChange={(e) => setNewInstitute({ ...newInstitute, code: e.target.value })}
                placeholder="bijv. TCR"
                maxLength={20}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowNewInstituteDialog(false);
              setNewInstitute({ name: "", code: "" });
              setDialogError(null);
            }}
          >
            Annuleren
          </Button>
          <Button onClick={handleCreateInstitute} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Bezig..." : "Toevoegen"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* New Academy Dialog */}
      <Dialog open={showNewAcademyDialog} onClose={() => setShowNewAcademyDialog(false)}>
        <DialogHeader onClose={() => setShowNewAcademyDialog(false)}>
          <div className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Nieuwe academie/faculteit toevoegen
          </div>
        </DialogHeader>
        <DialogContent>
          {dialogError && (
            <Alert variant="error" title="Fout">
              {dialogError}
            </Alert>
          )}

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600">
              School: <strong>{institutes.find(i => i.id === selectedInstituteId)?.name}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam academie/faculteit
              </label>
              <input
                type="text"
                value={newAcademy.name}
                onChange={(e) => setNewAcademy({ ...newAcademy, name: e.target.value })}
                placeholder="bijv. Techniek, Zorg & Welzijn, CMI"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Afkorting/Code
              </label>
              <input
                type="text"
                value={newAcademy.code}
                onChange={(e) => setNewAcademy({ ...newAcademy, code: e.target.value })}
                placeholder="bijv. TECH, ZW, CMI"
                maxLength={20}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowNewAcademyDialog(false);
              setNewAcademy({ name: "", code: "" });
              setDialogError(null);
            }}
          >
            Annuleren
          </Button>
          <Button onClick={handleCreateAcademy} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Bezig..." : "Toevoegen"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
