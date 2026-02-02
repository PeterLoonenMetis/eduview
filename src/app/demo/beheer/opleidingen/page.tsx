import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgramList } from "@/components/admin/program/program-list";
import { getPrograms } from "@/lib/db/programs";
import { Plus } from "lucide-react";

// Force dynamic rendering - this page needs fresh data
export const dynamic = "force-dynamic";

export default async function OpleidingenPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Opleidingen</h1>
          <p className="text-muted-foreground">
            Beheer alle opleidingen binnen de instelling
          </p>
        </div>
        <Link href="/demo/nieuw">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe opleiding
          </Button>
        </Link>
      </div>

      <ProgramList programs={programs} />
    </div>
  );
}
