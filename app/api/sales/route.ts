import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todas las ventas
export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        workOrder: {
          include: {
            client: true,
            vehicle: true,
          },
        },
        client: true,
      },
      orderBy: {
        saleDate: "desc",
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 },
    );
  }
}

// POST - Crear nueva venta desde orden de trabajo
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.workOrderId) {
      return NextResponse.json(
        { error: "El ID de orden de trabajo es requerido" },
        { status: 400 },
      );
    }

    // Verificar que la orden existe y está completada
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: data.workOrderId },
      include: { client: true, vehicle: true },
    });

    if (!workOrder) {
      return NextResponse.json(
        { error: "Orden de trabajo no encontrada" },
        { status: 404 },
      );
    }

    if (workOrder.status !== "completed") {
      return NextResponse.json(
        {
          error:
            "La orden de trabajo debe estar completada para crear una venta",
        },
        { status: 400 },
      );
    }

    // Verificar que no existe ya una venta para esta orden
    const existingSale = await prisma.sale.findUnique({
      where: { workOrderId: data.workOrderId },
    });

    if (existingSale) {
      return NextResponse.json(
        { error: "Ya existe una venta para esta orden de trabajo" },
        { status: 400 },
      );
    }

    // Generar número de venta único
    const lastSale = await prisma.sale.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const saleNumber = lastSale
      ? `SALE-${String(parseInt(lastSale.saleNumber.split("-")[1]) + 1).padStart(4, "0")}`
      : "SALE-0001";

    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        workOrderId: data.workOrderId,
        clientId: workOrder.clientId,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus || "pending",
        invoiceNumber: data.invoiceNumber || null,
        saleDate: data.saleDate ? new Date(data.saleDate) : new Date(),
        notes: data.notes || null,
      },
      include: {
        workOrder: {
          include: {
            client: true,
            vehicle: true,
          },
        },
        client: true,
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    console.error("Error creating sale:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una venta con este número" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear venta" },
      { status: 500 },
    );
  }
}
