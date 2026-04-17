import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener venta específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        workOrder: {
          include: {
            client: true,
            vehicle: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        client: true,
      },
    });

    if (!sale) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return NextResponse.json(
      { error: "Error al obtener venta" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar venta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        total: data.total,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        invoiceNumber: data.invoiceNumber,
        saleDate: data.saleDate ? new Date(data.saleDate) : undefined,
        notes: data.notes,
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

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json(
      { error: "Error al actualizar venta" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar venta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.sale.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Venta eliminada" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: "Error al eliminar venta" },
      { status: 500 },
    );
  }
}
