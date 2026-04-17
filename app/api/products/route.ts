import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todos los productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: {
            orderItems: true,
            quotationItems: true,
            stockMovements: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 },
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.code || !data.name || !data.category) {
      return NextResponse.json(
        { error: "Código, nombre y categoría son requeridos" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description || null,
        category: data.category,
        price: data.price,
        cost: data.cost || null,
        quantity: data.quantity || 0,
        unit: data.unit || "unit",
        supplier: data.supplier || null,
        minStock: data.minStock || 5,
        maxStock: data.maxStock || 100,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un producto con este código" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 },
    );
  }
}
