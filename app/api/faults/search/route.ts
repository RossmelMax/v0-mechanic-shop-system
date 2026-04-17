import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Búsqueda full-text en la base de fallas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");
    const system = searchParams.get("system");
    const severity = searchParams.get("severity");
    const computerRequired = searchParams.get("computerRequired");

    if (!q || q.trim().length === 0) {
      // Si no hay búsqueda, retornar fallas comunes
      const faults = await prisma.faultDatabase.findMany({
        where: {
          isCommon: true,
          ...(system ? { affectedSystems: { contains: system } } : {}),
          ...(severity ? { severity } : {}),
          ...(computerRequired
            ? { computerRequired: computerRequired === "true" }
            : {}),
        },
        take: 20,
      });
      return NextResponse.json(faults);
    }

    // Búsqueda en múltiples campos
    const searchTerm = q.toLowerCase();

    const faults = await prisma.faultDatabase.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { symptoms: { contains: searchTerm } },
          { keywords: { contains: searchTerm } },
          { code: { contains: searchTerm } },
        ],
        ...(system ? { affectedSystems: { contains: system } } : {}),
        ...(severity ? { severity } : {}),
        ...(computerRequired
          ? { computerRequired: computerRequired === "true" }
          : {}),
      },
      take: 20,
    });

    return NextResponse.json(faults);
  } catch (error) {
    console.error("Error searching faults:", error);
    return NextResponse.json(
      { error: "Error al buscar fallas" },
      { status: 500 },
    );
  }
}
