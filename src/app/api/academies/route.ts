import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instituteId = searchParams.get("instituteId");

    const academies = await prisma.academy.findMany({
      where: instituteId ? { instituteId } : undefined,
      include: {
        institute: true,
        _count: {
          select: { programs: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: academies });
  } catch (error) {
    console.error("API: Error fetching academies:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Onbekende fout" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("API: Creating academy with data:", JSON.stringify(body));

    const { instituteId, name, code, description } = body;

    if (!instituteId || !name || !code) {
      return NextResponse.json(
        { success: false, error: "Instituut, naam en code zijn verplicht" },
        { status: 400 }
      );
    }

    // Verify institute exists
    const institute = await prisma.institute.findUnique({
      where: { id: instituteId },
    });

    if (!institute) {
      return NextResponse.json(
        { success: false, error: "Instituut niet gevonden" },
        { status: 404 }
      );
    }

    // Check if code already exists for this institute
    const existing = await prisma.academy.findFirst({
      where: {
        instituteId,
        code: code.toUpperCase()
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Een academie met deze code bestaat al binnen dit instituut" },
        { status: 400 }
      );
    }

    const academy = await prisma.academy.create({
      data: {
        instituteId,
        name,
        code: code.toUpperCase(),
        description: description || null,
      },
      include: {
        institute: true,
      },
    });

    console.log("API: Academy created:", academy.id);

    return NextResponse.json({
      success: true,
      data: {
        id: academy.id,
        name: academy.name,
        code: academy.code,
        instituteId: academy.instituteId,
        institute: academy.institute,
      },
    });
  } catch (error) {
    console.error("API: Error creating academy:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Onbekende fout" },
      { status: 500 }
    );
  }
}
