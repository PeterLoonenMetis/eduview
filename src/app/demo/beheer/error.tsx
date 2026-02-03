"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function BeheerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Beheer page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Er ging iets mis</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        Er is een fout opgetreden. Dit kan een tijdelijk probleem zijn.
      </p>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-lg w-full">
        <p className="text-sm text-red-800 font-mono break-all">
          {error.message || "Onbekende server fout"}
        </p>
        {error.digest && (
          <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Opnieuw proberen
        </Button>
        <Link href="/demo">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Terug naar overzicht
          </Button>
        </Link>
      </div>
    </div>
  );
}
