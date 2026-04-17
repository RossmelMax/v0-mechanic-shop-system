import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Agregar item a cotización
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: quotationId } = await params;
    const data = await request.json();

    // Verificar que la cotización existe
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    // Crear el item
    const quotationItem = await prisma.quotationItem.create({
      data: {
        quotationId,
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
    console.error("Error creating quotation item:", error);
    return NextResponse.json(
      { error: "Error al crear item de cotización" },
      { status: 500 },
    );
  }
}
