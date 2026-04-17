import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todas las órdenes de trabajo
export async function GET() {
  try {
    const orders = await prisma.workOrder.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching work orders:", error);
    return NextResponse.json(
      { error: "Error al obtener órdenes de trabajo" },
      { status: 500 },
    );
  }
}

// POST - Crear nueva orden de trabajo desde cotización
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.quotationId) {
      return NextResponse.json(
        { error: "El ID de cotización es requerido" },
        { status: 400 },
      );
    }

    // Verificar que la cotización existe y está aceptada
    const quotation = await prisma.quotation.findUnique({
      where: { id: data.quotationId },
      include: { client: true, vehicle: true },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    if (quotation.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          error:
            "La cotización debe estar aceptada para crear una orden de trabajo",
        },
        { status: 400 },
      );
    }

    // Verificar que no existe ya una orden para esta cotización
    const existingOrder = await prisma.workOrder.findUnique({
      where: { quotationId: data.quotationId },
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: "Ya existe una orden de trabajo para esta cotización" },
        { status: 400 },
      );
    }

    // Generar número de orden único
    const lastOrder = await prisma.workOrder.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const orderNumber = lastOrder
      ? `WO-${String(parseInt(lastOrder.workOrderNumber.split("-")[1]) + 1).padStart(4, "0")}`
      : "WO-0001";

    const workOrder = await prisma.workOrder.create({
      data: {
        workOrderNumber: orderNumber,
        quotationId: data.quotationId,
        clientId: quotation.clientId,
        vehicleId: quotation.vehicleId,
        mechanic: data.mechanic || null,
        notes: data.notes || null,
      },
      include: {
        client: true,
        vehicle: true,
        quotation: true,
      },
    });

    return NextResponse.json(workOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una orden con este número" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear orden de trabajo" },
      { status: 500 },
    );
  }
}
