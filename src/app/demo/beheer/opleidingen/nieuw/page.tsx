import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleProgramForm } from "@/components/admin/program/simple-program-form";
import { getAcademies, getInstitutes } from "@/lib/db/institutes";
import { ArrowLeft } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function NieuweOpleidingPage() {
  let academies;
  let institutes;

  try {
    [academies, institutes] = await Promise.all([
      getAcademies(),
      getInstitutes(),
    ]);
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">Fout bij laden</h2>
          <p className="text-red-700 mt-2">
            Kon de gegevens niet laden. Probeer de pagina te verversen.
          </p>
          <p className="text-red-600 text-sm mt-2">
            {error instanceof Error ? error.message : "Onbekende fout"}
          </p>
        </div>
      </div>
    );
  }

  // Serialize data to avoid Date object issues
  const serializedAcademies = JSON.parse(JSON.stringify(academies));
  const serializedInstitutes = JSON.parse(JSON.stringify(institutes));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/demo/beheer/opleidingen">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nieuwe opleiding</h1>
          <p className="text-muted-foreground">
            Configureer stap voor stap een nieuwe opleiding
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <SimpleProgramForm academies={serializedAcademies} institutes={serializedInstitutes} />
      </div>
    </div>
  );
}
