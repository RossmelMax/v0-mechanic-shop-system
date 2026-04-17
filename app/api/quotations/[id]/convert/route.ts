import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: quotationId } = await params;

    // 1. Buscamos la cotización original
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    if (quotation.status === "CONVERTED_TO_ORDER") {
      return NextResponse.json(
        { error: "Esta cotización ya fue convertida" },
        { status: 400 },
      );
    }

    // 2. Transacción de Prisma: Actualizar Cotización + Crear Orden
    const result = await prisma.$transaction(async (tx) => {
      // Generar el número de orden (ej. WO-0005)
      const orderCount = await tx.workOrder.count();
      const nextOrderNumber = `WO-${String(orderCount + 1).padStart(4, "0")}`;

      // Crear la Work Order heredando los datos
      const newOrder = await tx.workOrder.create({
        data: {
          workOrderNumber: nextOrderNumber,
          quotationId: quotation.id,
          clientId: quotation.clientId,
          vehicleId: quotation.vehicleId,
          status: "pending", // El auto está en cola para ser atendido
          startDate: new Date(),
          notes:
            quotation.diagnosisMechanicNotes || "Generado desde cotización",
          totalCost: quotation.estimatedTotal || 0,
        },
      });

      // Actualizar el estado de la cotización
      await tx.quotation.update({
        where: { id: quotation.id },
        data: { status: "CONVERTED_TO_ORDER" },
      });

      return newOrder;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error al convertir cotización:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
