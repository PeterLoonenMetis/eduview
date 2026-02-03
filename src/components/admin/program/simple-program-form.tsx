"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Plus, Building2, School, GraduationCap, Loader2 } from "lucide-react";

interface Institute {
  id: string;
  name: string;
  code: string;
}

interface Academy {
  id: string;
  instituteId: string;
  name: string;
  code: string;
  institute: Institute;
}

interface SimpleProgramFormProps {
  academies: Academy[];
  institutes: Institute[];
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

export function SimpleProgramForm({ academies, institutes }: SimpleProgramFormProps) {
  const router = useRouter();

  // Form state
  const [selectedInstituteId, setSelectedInstituteId] = useState(institutes[0]?.id || "");
  const [selectedAcademyId, setSelectedAcademyId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [educationType, setEducationType] = useState("MBO");
  const [degreeType, setDegreeType] = useState("MBO4");
  const [crohoCode, setCrohoCode] = useState("");
  const [durationYears, setDurationYears] = useState("4");
  const [totalCredits, setTotalCredits] = useState("240");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const response = await fetch("/api/programs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyId: selectedAcademyId,
          name,
          code,
          educationType,
          degreeType,
          crohoCode: crohoCode || undefined,
          durationYears: parseInt(durationYears),
          totalCredits: parseInt(totalCredits),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Wait a moment then redirect
        setTimeout(() => {
          router.push("/demo/beheer/opleidingen");
          router.refresh();
        }, 1000);
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setError(result.error || "Er is een fout opgetreden");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Kon geen verbinding maken met de server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="error" title="Fout">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Succes">
          Opleiding is aangemaakt! Je wordt doorgestuurd...
        </Alert>
      )}

      {/* Step 1: School/Instituut */}
      <div className="rounded-lg border bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold">Stap 1: Kies een school/instituut</h3>
        </div>

        <select
          value={selectedInstituteId}
          onChange={(e) => handleInstituteChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          required
        >
          <option value="">-- Selecteer school/instituut --</option>
          {institutes.map((institute) => (
            <option key={institute.id} value={institute.id}>
              {institute.name} ({institute.code})
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Academy/Faculteit */}
      {selectedInstituteId && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <School className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold">Stap 2: Kies een academie/faculteit</h3>
          </div>

          <select
            value={selectedAcademyId}
            onChange={(e) => setSelectedAcademyId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          >
            <option value="">-- Selecteer academie/faculteit --</option>
            {filteredAcademies.map((academy) => (
              <option key={academy.id} value={academy.id}>
                {academy.name} ({academy.code})
              </option>
            ))}
          </select>
          {filteredAcademies.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Deze school heeft nog geen academies.
            </p>
          )}
          {fieldErrors.academyId && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.academyId[0]}</p>
          )}
        </div>
      )}

      {/* Step 3: Opleiding details */}
      {selectedAcademyId && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold">Stap 3: Opleidingsgegevens</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam opleiding *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="bijv. Mechatronica, HBO-ICT"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="bijv. MECH, ICT"
                maxLength={10}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
              {fieldErrors.code && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.code[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Onderwijstype
              </label>
              <select
                value={educationType}
                onChange={(e) => setEducationType(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {educationTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau/Diploma
              </label>
              <select
                value={degreeType}
                onChange={(e) => setDegreeType(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {degreeTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CROHO/Crebo-code (optioneel)
              </label>
              <input
                type="text"
                value={crohoCode}
                onChange={(e) => setCrohoCode(e.target.value)}
                placeholder="bijv. 34479"
                maxLength={10}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duur (jaren)
              </label>
              <input
                type="number"
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
                min={1}
                max={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Totaal studiepunten
              </label>
              <input
                type="number"
                value={totalCredits}
                onChange={(e) => setTotalCredits(e.target.value)}
                min={0}
                max={300}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Annuleren
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !selectedAcademyId || !name || !code}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Bezig...
            </>
          ) : (
            "Opleiding aanmaken"
          )}
        </Button>
      </div>
    </form>
  );
}
