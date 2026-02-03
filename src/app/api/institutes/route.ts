import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const institutes = await prisma.institute.findMany({
      include: {
        academies: {
          include: {
            _count: {
              select: { programs: true },
            },
          },
        },
        _count: {
          select: { academies: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: institutes });
  } catch (error) {
    console.error("API: Error fetching institutes:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Onbekende fout" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("API: Creating institute with data:", JSON.stringify(body));

    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: "Naam en code zijn verplicht" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.institute.findFirst({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Een instituut met deze code bestaat al" },
        { status: 400 }
      );
    }

    const institute = await prisma.institute.create({
      data: {
        name,
        code: code.toUpperCase(),
        primaryColor: "#164B44",
        secondaryColor: "#E8AE27",
      },
    });

    console.log("API: Institute created:", institute.id);

    return NextResponse.json({
      success: true,
      data: { id: institute.id, name: institute.name, code: institute.code },
    });
  } catch (error) {
    console.error("API: Error creating institute:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Onbekende fout" },
      { status: 500 }
    );
  }
}
