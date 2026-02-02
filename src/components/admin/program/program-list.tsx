"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  School,
  Pencil,
  Trash2,
  Users,
  BookOpen
} from "lucide-react";
import { formatCredits } from "@/lib/education-types/terminology";
import { deleteProgram } from "@/app/actions/programs";
import { enumLabels } from "@/lib/utils";

interface ProgramWithRelations {
  id: string;
  name: string;
  code: string;
  crohoCode: string | null;
  degreeType: string;
  durationYears: number;
  totalCredits: number;
  educationType: "MBO" | "HBO";
  academy: {
    name: string;
    institute: {
      name: string;
    };
  };
  _count: {
    cohorts: number;
  };
}

interface ProgramListProps {
  programs: ProgramWithRelations[];
}

export function ProgramList({ programs }: ProgramListProps) {
  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Geen opleidingen</h3>
          <p className="text-muted-foreground">
            Er zijn nog geen opleidingen aangemaakt.
          </p>
          <Link href="/demo/nieuw">
            <Button className="mt-4">Eerste opleiding aanmaken</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <Card key={program.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`rounded-xl p-3 ${
                  program.educationType === "MBO"
                    ? "bg-blue-100"
                    : "bg-teal-100"
                }`}>
                  {program.educationType === "MBO" ? (
                    <School className={`h-6 w-6 ${
                      program.educationType === "MBO"
                        ? "text-blue-600"
                        : "text-teal-600"
                    }`} />
                  ) : (
                    <GraduationCap className="h-6 w-6 text-teal-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{program.name}</h3>
                    <Badge variant="outline">{program.code}</Badge>
                    <Badge className={
                      program.educationType === "MBO"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        : "bg-teal-100 text-teal-700 hover:bg-teal-100"
                    }>
                      {program.educationType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {program.academy.institute.name} • {program.academy.name}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {enumLabels[program.degreeType as keyof typeof enumLabels] || program.degreeType}
                    </span>
                    <span>{program.durationYears} jaar</span>
                    <span>{formatCredits(program.educationType, program.totalCredits)}</span>
                    {program.crohoCode && (
                      <span>CROHO: {program.crohoCode}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mr-4">
                  <Users className="h-4 w-4" />
                  <span>{program._count.cohorts} cohorten</span>
                </div>
                <Link href={`/demo/beheer/opleidingen/${program.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <form
                  action={async () => {
                    if (confirm("Weet je zeker dat je deze opleiding wilt verwijderen?")) {
                      await deleteProgram(program.id);
                    }
                  }}
                >
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
