import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    const institutes = await prisma.institute.findMany();
    const academies = await prisma.academy.findMany();
    const programs = await prisma.program.findMany();

    return NextResponse.json({
      success: true,
      data: {
        institutes: institutes.length,
        academies: academies.length,
        programs: programs.length,
        institutesList: institutes,
        academiesList: academies,
        programsList: programs,
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
