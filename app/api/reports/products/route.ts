import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serializeBigInt } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Estadísticas de productos
    const [
      totalProducts,
      productsByCategory,
      lowStockProducts,
      outOfStockProducts,
      topSellingProducts,
      productMovements,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.groupBy({
        by: ["category"],
        _count: { category: true },
      }),
      prisma.product.findMany({
        where: {
          quantity: {
            lte: prisma.product.fields.minStock,
          },
        },
        select: {
          id: true,
          code: true,
          name: true,
          quantity: true,
          minStock: true,
          category: true,
        },
        orderBy: { quantity: "asc" },
      }),
      prisma.product.findMany({
        where: { quantity: 0 },
        select: {
          id: true,
          code: true,
          name: true,
          category: true,
        },
      }),
      prisma.$queryRaw<
        Array<{
          productId: string;
          productName: string;
          category: string;
          totalSold: number;
          revenue: number;
          lastSold: string;
        }>
      >`
        SELECT
          p.id as productId,
          p.name as productName,
          p.category,
          COALESCE(SUM(oi.quantity), 0) as totalSold,
          COALESCE(SUM(oi.subtotal), 0) as revenue,
          MAX(wo.createdAt) as lastSold
        FROM Product p
        LEFT JOIN OrderItem oi ON p.id = oi.productId
        LEFT JOIN WorkOrder wo ON oi.workOrderId = wo.id
        WHERE wo.status = 'completed'
        GROUP BY p.id, p.name, p.category
        ORDER BY revenue DESC
        LIMIT 20
      `,
      prisma.stockMovement.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              id: true,
              code: true,
              name: true,
              category: true,
            },
          },
        },
      }),
    ]);

    // Valor total del inventario
    const inventoryValue = await prisma.product.aggregate({
      _sum: {
        quantity: true,
      },
    });

    // Productos con más movimientos
    const productsWithMostMovements = await prisma.$queryRaw<
      Array<{
        productId: string;
        productName: string;
        totalMovements: number;
        lastMovement: string;
      }>
    >`
      SELECT
        p.id as productId,
        p.name as productName,
        COUNT(sm.id) as totalMovements,
        MAX(sm.createdAt) as lastMovement
      FROM Product p
      LEFT JOIN StockMovement sm ON p.id = sm.productId
      GROUP BY p.id, p.name
      ORDER BY totalMovements DESC
      LIMIT 10
    `;

    return NextResponse.json(serializeBigInt({
      summary: {
        totalProducts,
        totalInventoryValue: inventoryValue._sum.quantity || 0,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      },
      productsByCategory: productsByCategory.map((item) => ({
        category: item.category,
        count: item._count.category,
      })),
      lowStockProducts,
      outOfStockProducts,
      topSellingProducts,
      productsWithMostMovements,
      recentMovements: productMovements,
    }));
  } catch (error) {
    console.error("Error fetching products report:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
