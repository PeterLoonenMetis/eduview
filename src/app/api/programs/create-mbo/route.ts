import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("API: Creating MBO program with data:", JSON.stringify(body));

    const {
      academyId,
      name,
      code,
      durationYears = 4,
      niveau = "NIVEAU_4",
      leerweg = "BOL",
      ontwerpprincipe = "HYBRIDE",
      kdNaam,
      kdVersie,
      kdPeildatum,
    } = body;

    // Validate required fields
    if (!academyId || !name || !code) {
      return NextResponse.json(
        { success: false, error: "Academie, naam en code zijn verplicht" },
        { status: 400 }
      );
    }

    // Create program
    const program = await prisma.program.create({
      data: {
        academyId,
        name,
        code,
        educationType: "MBO",
        degreeType: niveau === "NIVEAU_4" ? "MBO4" : niveau === "NIVEAU_3" ? "MBO3" : "MBO2",
        durationYears: parseInt(durationYears) || 4,
        totalCredits: 0,
      },
    });

    console.log("API: Program created:", program.id);

    // Create MBO config
    await prisma.mBOConfig.create({
      data: {
        programId: program.id,
        leerweg,
        niveau,
        ontwerpprincipe,
        kdNaam: kdNaam || null,
        kdVersie: kdVersie || null,
        kdPeildatum: kdPeildatum ? new Date(kdPeildatum) : null,
      },
    });

    console.log("API: MBO config created");

    return NextResponse.json({
      success: true,
      data: { id: program.id, name: program.name },
    });
  } catch (error) {
    console.error("API: Error creating MBO program:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Onbekende fout" },
      { status: 500 }
    );
  }
}
