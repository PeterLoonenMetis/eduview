import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        educationType: true,
      },
      orderBy: { name: "asc" },
    });

    const cohorts = await prisma.cohort.findMany({
      select: {
        id: true,
        name: true,
        startYear: true,
        endYear: true,
        programId: true,
      },
      orderBy: { startYear: "desc" },
    });

    return NextResponse.json({ programs, cohorts });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
