import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "@/components/admin/program/program-form";
import { getAcademies, getInstitutes } from "@/lib/db/institutes";
import { ArrowLeft } from "lucide-react";

export default async function NieuweOpleidingPage() {
  const [academies, institutes] = await Promise.all([
    getAcademies(),
    getInstitutes(),
  ]);

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
        <ProgramForm academies={academies} institutes={institutes} />
      </div>
    </div>
  );
}
