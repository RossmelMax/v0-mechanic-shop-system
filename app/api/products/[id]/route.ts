import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            workOrder: {
              include: {
                client: true,
                vehicle: true,
              },
            },
          },
        },
        quotationItems: {
          include: {
            quotation: {
              include: {
                client: true,
                vehicle: true,
              },
            },
          },
        },
        stockMovements: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        cost: data.cost,
        quantity: data.quantity,
        unit: data.unit,
        supplier: data.supplier,
        minStock: data.minStock,
        maxStock: data.maxStock,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un producto con este código" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // Verificar que no tenga items asociados
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        quotationItems: true,
      },
    });

    if (product?.orderItems.length || product?.quotationItems.length) {
      return NextResponse.json(
        { error: "No se puede eliminar un producto que tiene items asociados" },
        { status: 400 },
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 },
    );
  }
}
