import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Actualizar item de cotización
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id: quotationId, itemId } = await params;
    const data = await request.json();

    const quotationItem = await prisma.quotationItem.update({
      where: {
        id: itemId,
        quotationId, // Asegurar que el item pertenece a la cotización
      },
      data: {
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        subtotal: data.subtotal,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(quotationItem);
  } catch (error: any) {
    console.error("Error updating quotation item:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Item de cotización no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar item de cotización" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar item de cotización
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id: quotationId, itemId } = await params;

    await prisma.quotationItem.delete({
      where: {
        id: itemId,
        quotationId, // Asegurar que el item pertenece a la cotización
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting quotation item:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Item de cotización no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar item de cotización" },
      { status: 500 },
    );
  }
}
