import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { programSchema } from "@/lib/validations/program";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("API: Received program data:", JSON.stringify(body));

    // Validate the data
    const validated = programSchema.safeParse(body);

    if (!validated.success) {
      console.log("API: Validation failed:", validated.error.flatten());
      return NextResponse.json(
        {
          success: false,
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.log("API: Validation passed, creating program...");

    // Create the program
    const program = await prisma.program.create({
      data: {
        academyId: validated.data.academyId,
        name: validated.data.name,
        code: validated.data.code,
        crohoCode: validated.data.crohoCode || null,
        educationType: validated.data.educationType || "MBO",
        degreeType: validated.data.degreeType || "MBO4",
        durationYears: validated.data.durationYears || 4,
        totalCredits: validated.data.totalCredits || 240,
      },
    });

    console.log("API: Program created successfully:", program.id);

    return NextResponse.json({
      success: true,
      data: {
        id: program.id,
        name: program.name,
      },
    });
  } catch (error) {
    console.error("API: Error creating program:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Onbekende fout",
      },
      { status: 500 }
    );
  }
}
