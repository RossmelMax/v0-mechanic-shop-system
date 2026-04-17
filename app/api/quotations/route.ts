import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Generar número de cotización único
function generateQuotationNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(4, "0");
  return `COT-${year}${month}${day}-${random}`;
}

// GET - Obtener todas las cotizaciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    const quotations = await prisma.quotation.findMany({
      where: {
        ...(clientId ? { clientId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        client: true,
        vehicle: true,
        diagnostics: true,
        quotationItems: {
          include: {
            product: true,
          },
        },
        workOrder: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Error al obtener cotizaciones" },
      { status: 500 },
    );
  }
}

// POST - Crear nueva cotización
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validación
    if (!data.clientId || !data.vehicleId) {
      return NextResponse.json(
        { error: "clientId y vehicleId son requeridos" },
        { status: 400 },
      );
    }

    const quotationNumber = generateQuotationNumber();

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        clientId: data.clientId,
        vehicleId: data.vehicleId,
        status: "pending",
        estimatedTotal: data.estimatedTotal || 0,
        diagnosisDate: data.diagnosisDate ? new Date(data.diagnosisDate) : null,
        diagnosisMechanicNotes: data.diagnosisMechanicNotes || null,
        externalDiagnosisCode: data.externalDiagnosisCode || null,
      },
      include: {
        client: true,
        vehicle: true,
        diagnostics: true,
        quotationItems: true,
      },
    });

    return NextResponse.json(quotation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating quotation:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Cliente o vehículo no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear cotización" },
      { status: 500 },
    );
  }
}
