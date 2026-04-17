import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener orden de trabajo específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        client: true,
        vehicle: true,
        quotation: {
          include: {
            diagnostics: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
        sale: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden de trabajo no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching work order:", error);
    return NextResponse.json(
      { error: "Error al obtener orden de trabajo" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar orden de trabajo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const order = await prisma.workOrder.update({
      where: { id },
      data: {
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        completionDate: data.completionDate
          ? new Date(data.completionDate)
          : undefined,
        mechanic: data.mechanic,
        notes: data.notes,
        totalCost: data.totalCost,
      },
      include: {
        client: true,
        vehicle: true,
        quotation: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating work order:", error);
    return NextResponse.json(
      { error: "Error al actualizar orden de trabajo" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar orden de trabajo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // Verificar que no tenga venta asociada
    const order = await prisma.workOrder.findUnique({
      where: { id },
      include: { sale: true },
    });

    if (order?.sale) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar una orden que ya tiene una venta asociada",
        },
        { status: 400 },
      );
    }

    await prisma.workOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Orden de trabajo eliminada" });
  } catch (error) {
    console.error("Error deleting work order:", error);
    return NextResponse.json(
      { error: "Error al eliminar orden de trabajo" },
      { status: 500 },
    );
  }
}
